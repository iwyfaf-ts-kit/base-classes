import { describe, it, expect, beforeEach } from 'vitest';
import { TestUserDto } from './test-data/base.dto.test-data';
import { BaseDto } from '../base.dto';

describe('BaseDto', () => {
  let userDto: TestUserDto;

  beforeEach(async () => {
    userDto = new TestUserDto({ id: 1, name: 'Alice', tags: ['admin', 'user'] });
  });

  describe('toJSON', () => {
    it('Should correctly serialize the DTO instance into a plain object.', () => {
      const json = userDto.toJSON();

      console.log(json, 'json');

      expect(json).toBeDefined();
      expect(json).toEqual({ id: 1, name: 'Alice', tags: ['admin', 'user'] });
      // Убедимся, что это именно новый объект, а не ссылка на исходный
      expect(json).not.toBe(userDto);
    });
  });

  describe('isPropertyNull', () => {
    let dtoWithNulls: TestUserDto;

    beforeEach(() => {
      dtoWithNulls = new TestUserDto({ id: 1, name: '', tags: [] });
    });

    it('Should return true if a property is null.', () => {
      (dtoWithNulls as any).nullField = null;

      // @ts-ignore
      expect(dtoWithNulls.isPropertyNull('nullField')).toBe(true);
    });

    it('Should return true if a property is undefined.', () => {
      (dtoWithNulls as any).undefinedField = undefined;

      // @ts-ignore
      expect(dtoWithNulls.isPropertyNull('undefinedField')).toBe(true);
    });

    it('Should return true if a string property is empty.', () => {
      expect(dtoWithNulls.isPropertyNull('name')).toBe(true);
    });

    it('Should return true if an array property is empty.', () => {
      expect(dtoWithNulls.isPropertyNull('tags')).toBe(true);
    });

    it('Should return false if a property has a valid value.', () => {
      expect(dtoWithNulls.isPropertyNull('id')).toBe(false);
    });
  });

  describe('isObjNull', () => {
    it('Should return true if the provided object is null.', () => {
      expect(userDto.isObjNull(null)).toBe(true);
    });

    it('Should return false if the provided object is not null.', () => {
      const obj = { key: 'value' };

      expect(userDto.isObjNull(obj)).toBe(false);
    });
  });

  describe('isObjEmpty', () => {
    it('Should return true if the provided object has no own enumerable properties.', () => {
      const emptyObj = {};

      expect(userDto.isObjEmpty(emptyObj)).toBe(true);
    });

    it('Should return false if the provided object has properties.', () => {
      const nonEmptyObj = { key: 'value' };

      expect(userDto.isObjEmpty(nonEmptyObj)).toBe(false);
    });

    it('Should return false if the provided value is null.', () => {
      expect(userDto.isObjEmpty(null)).toBe(false);
    });
  });

  describe('isObjNull', () => {
    it('Should return true if the provided object is null.', () => {
      expect(userDto.isObjNull(null)).toBe(true);
    });

    it('Should return false if the provided object is not null.', () => {
      const obj = { key: 'value' };

      expect(userDto.isObjNull(obj)).toBe(false);
    });
  });

  describe('isObjPropertyNull', () => {
    it('Should return true if the object itself is null.', () => {
      // @ts-ignore
      expect(userDto.isObjPropertyNull(null, 'anyKey')).toBe(true);
    });

    it('Should return true if the specified property of the object is null.', () => {
      const obj = { key: null };

      expect(userDto.isObjPropertyNull(obj, 'key')).toBe(true);
    });

    it('Should return true if the specified property of the object is undefined.', () => {
      const obj = { key: undefined };
      expect(userDto.isObjPropertyNull(obj, 'key')).toBe(true);
    });

    it('Should return false if the object and its property are not null or undefined.', () => {
      const obj = { key: 'value' };

      expect(userDto.isObjPropertyNull(obj, 'key')).toBe(false);
    });
  });

  describe('Change Tracking', () => {
    describe('hasChanged', () => {
      it('Should return false for a newly created DTO.', () => {
        expect(userDto.hasChanged()).toBe(false);
      });

      it('Should return true after a property has been modified.', () => {
        userDto.name = 'Bob';
        expect(userDto.hasChanged()).toBe(true);
      });

      it('Should return false after changes are reset.', () => {
        userDto.name = 'Bob';
        userDto.resetChanges();

        expect(userDto.hasChanged()).toBe(false);
      });

      it('Should detect changes in nested object properties.', () => {
        const dtoWithNested = new (class extends BaseDto<{ data: { value: number } }> {
          public data: { value: number };
          constructor() {
            super();
            this.data = { value: 10 };
            this._initChangeTracker();
          }
        })();

        dtoWithNested.data.value = 20;
        expect(dtoWithNested.hasChanged()).toBe(true);
      });
    });

    describe('getDirtyFields', () => {
      it('Should return an empty array for a newly created DTO.', () => {
        expect(userDto.getDirtyFields()).toEqual([]);
      });

      it('Should return an array with the names of modified top-level fields.', () => {
        userDto.name = 'Bob';
        userDto.id = 99;
        const dirtyFields = userDto.getDirtyFields();

        expect(dirtyFields).toBeDefined();
        expect(dirtyFields).toContain('name');
        expect(dirtyFields).toContain('id');
        expect(dirtyFields).not.toContain('tags');
      });

      it('Should return paths for modified nested properties.', () => {
        const dtoWithNested = new (class extends BaseDto<{ data: { inner: { value: string } } }> {
          public data: { inner: { value: string } };
          constructor() {
            super();
            this.data = { inner: { value: 'old' } };
            this._initChangeTracker();
          }
        })();

        dtoWithNested.data.inner.value = 'new';
        const dirtyFields = dtoWithNested.getDirtyFields();

        expect(dirtyFields).toEqual(['data.inner.value']);
      });

      it('Should return an empty array after changes are reset.', () => {
        userDto.name = 'Bob';
        userDto.resetChanges();

        expect(userDto.getDirtyFields()).toEqual([]);
      });
    });

    describe('commitChanges', () => {
      it('Should update original data snapshot after commit', () => {
        userDto.name = 'Bob';
        userDto.commitChanges();

        expect(userDto.hasChanged()).toBe(false);
        userDto.name = 'Charlie';

        expect(userDto.hasChanged()).toBe(true);
        userDto.resetChanges();

        expect(userDto.name).toBe('Bob');
      });

      it('Should mark DTO as unchanged after commit', () => {
        userDto.name = 'Bob';
        expect(userDto.hasChanged()).toBe(true);

        userDto.commitChanges();
        expect(userDto.hasChanged()).toBe(false);
      });

      it('Should preserve changes after commit when making new modifications', () => {
        userDto.name = 'Bob';
        userDto.commitChanges();

        userDto.name = 'Charlie';
        expect(userDto.hasChanged()).toBe(true);
        expect(userDto.getDirtyFields()).toContain('name');
      });

      it('Should work with nested object properties', () => {
        const dtoWithNested = new (class extends BaseDto<{ data: { value: number } }> {
          public data: { value: number };
          constructor() {
            super();
            this.data = { value: 10 };
            this._initChangeTracker();
          }
        })();

        dtoWithNested.data.value = 20;
        dtoWithNested.commitChanges();

        expect(dtoWithNested.hasChanged()).toBe(false);
        dtoWithNested.data.value = 30;
        expect(dtoWithNested.hasChanged()).toBe(true);
      });
    });

    describe('resetChanges', () => {
      it('Should revert all properties to their original values.', () => {
        const originalName = userDto.name;
        userDto.name = 'Bob';
        userDto.tags.push('newTag');

        userDto.resetChanges();

        expect(userDto.name).toBe(originalName);
        expect(userDto.tags).toEqual(['admin', 'user']);
      });

      it('Should set the state to unchanged after reset.', () => {
        userDto.name = 'Bob';
        userDto.resetChanges();

        expect(userDto.hasChanged()).toBe(false);
      });
    });
  });
});
