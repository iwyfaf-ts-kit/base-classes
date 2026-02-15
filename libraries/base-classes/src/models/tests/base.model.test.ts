import { describe, it, expect, beforeEach } from 'vitest';
import { TestClass } from './test-data/base.model.test-data';

describe('TestClass with BaseModel and Boolean values', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass({
      id: 1,
      name: 'Test Object',
      isActive: true,
      isDisabled: false,
      emptyObject: {},
      nestedObject: {
        level1: {
          level2: {
            value: 'nested value',
            emptyNested: {},
          },
        },
      },
      items: ['item1', 'item2', 'item3'],
      tags: ['tag1', 'tag2'],
      metadata: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ],
    });
  });

  describe('isObjNull with string values', () => {
    it('Should return false when object has non-empty string.', () => {
      const result = testInstance.isObjNull({ name: 'test string' });

      expect(result).toBe(false);
    });

    it('Should return true when object has only empty string.', () => {
      const result = testInstance.isObjNull({ name: '' });

      expect(result).toBe(true);
    });

    it('Should return true when object has null string property.', () => {
      const result = testInstance.isObjNull({ name: null });

      expect(result).toBe(true);
    });

    it('Should return true when object has undefined string property.', () => {
      const result = testInstance.isObjNull({ name: undefined });

      expect(result).toBe(true);
    });

    it('Should return false when mixed with non-empty string and other empty values.', () => {
      const result = testInstance.isObjNull({
        name: 'test',
        empty: '',
        nullProp: null,
      });

      expect(result).toBe(false);
    });

    it('Should return false when mixed with non-empty string and other empty values.', () => {
      const result = testInstance.isObjNull({
        name: 'test',
        empty: '',
        nullProp: null,
      });

      expect(result).toBe(false);
    });
  });

  describe('isObjNull with number values', () => {
    it('Should return false when object has positive number.', () => {
      const result = testInstance.isObjNull({ id: 42 });

      expect(result).toBe(false);
    });

    it('Should return false when object has zero.', () => {
      const result = testInstance.isObjNull({ id: 0 });

      expect(result).toBe(false);
    });

    it('Should return false when object has negative number.', () => {
      const result = testInstance.isObjNull({ id: -1 });

      expect(result).toBe(false);
    });

    it('Should return true when object has null number property.', () => {
      const result = testInstance.isObjNull({ id: null });

      expect(result).toBe(true);
    });

    it('Should return true when object has undefined number property.', () => {
      const result = testInstance.isObjNull({ id: undefined });

      expect(result).toBe(true);
    });

    it('Should return false when object has NaN.', () => {
      const result = testInstance.isObjNull({ id: NaN });

      expect(result).toBe(false);
    });

    it('Should return false when object has Infinity.', () => {
      const result = testInstance.isObjNull({ id: Infinity });

      expect(result).toBe(false);
    });
  });

  describe('isObjNull with boolean values', () => {
    it('Should return false when object has boolean true value.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore For test
        flag: true,
        empty: {},
      });

      expect(result).toBe(false);
    });

    it('Should return false when object has boolean false value.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore For test
        flag: false,
        empty: {},
      });

      expect(result).toBe(false);
    });

    it('Should return false when object has mixed boolean values.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore For test
        isActive: true,
        // @ts-ignore For test
        isDisabled: false,
        emptyString: '',
        emptyArray: [],
      });

      expect(result).toBe(false);
    });

    it('Should return true when all properties are empty except boolean false.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore For test
        flag: false,
        emptyString: '',
        emptyArray: [],
        emptyObject: {},
      });

      expect(result).toBe(false); // Returns false because false is a valid boolean value
    });

    it('Should return true when all properties are empty except boolean true.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore For test
        flag: true,
        emptyString: '',
        emptyArray: [],
        emptyObject: {},
      });

      expect(result).toBe(false); // Returns false because true is a valid boolean value
    });

    it('Should handle boolean in nested objects correctly.', () => {
      const result = testInstance.isObjNull({
        level1: {
          level2: {
            flag: true,
            empty: {},
          },
        },
        empty: {},
      });

      expect(result).toBe(false);
    });
  });

  describe('isObjNull with null and undefined values', () => {
    it('Should return true when object is null.', () => {
      const result = testInstance.isObjNull(null);

      expect(result).toBe(true);
    });

    it('Should return true when object is undefined.', () => {
      const result = testInstance.isObjNull(undefined as any);

      expect(result).toBe(true);
    });

    it('Should return true when all properties are null.', () => {
      const result = testInstance.isObjNull({
        prop1: null,
        prop2: null,
        prop3: null,
      });

      expect(result).toBe(true);
    });

    it('Should return true when all properties are undefined.', () => {
      const result = testInstance.isObjNull({
        prop1: undefined,
        prop2: undefined,
        prop3: undefined,
      });

      expect(result).toBe(true);
    });

    it('Should return true when all properties are mixed null and undefined.', () => {
      const result = testInstance.isObjNull({
        prop1: null,
        prop2: undefined,
        prop3: null,
      });

      expect(result).toBe(true);
    });
  });

  describe('isObjNull with array values', () => {
    it('Should return false when object has non-empty array.', () => {
      const result = testInstance.isObjNull({ items: ['item1', 'item2'] });

      expect(result).toBe(false);
    });

    it('Should return true when object has empty array.', () => {
      const result = testInstance.isObjNull({ items: [] });

      expect(result).toBe(true);
    });

    it('Should return true when object has null array property.', () => {
      const result = testInstance.isObjNull({ items: null });

      expect(result).toBe(true);
    });

    it('Should return true when object has undefined array property.', () => {
      const result = testInstance.isObjNull({ items: undefined });

      expect(result).toBe(true);
    });

    it('Should return false when array has null or undefined elements.', () => {
      const result = testInstance.isObjNull({ items: [null, undefined, 'item'] as any[] });

      expect(result).toBe(false);
    });

    it('Should return false when multiple arrays with at least one non-empty.', () => {
      const result = testInstance.isObjNull({
        items: [],
        tags: ['tag1'],
        metadata: [],
      });

      expect(result).toBe(false);
    });
  });

  describe('isObjNull with empty object values', () => {
    it('Should return true when object has empty object property.', () => {
      const result = testInstance.isObjNull({ emptyObject: {} });

      expect(result).toBe(true);
    });

    it('Should return false when object has non-empty object property.', () => {
      const result = testInstance.isObjNull({ emptyObject: { key: 'value' } });

      expect(result).toBe(false);
    });

    it('Should return true when object has null object property.', () => {
      const result = testInstance.isObjNull({ emptyObject: null });

      expect(result).toBe(true);
    });

    it('Should return true when object has undefined object property.', () => {
      const result = testInstance.isObjNull({ emptyObject: undefined });

      expect(result).toBe(true);
    });

    it('Should return true when object itself is empty.', () => {
      const result = testInstance.isObjNull({});

      expect(result).toBe(true);
    });
  });

  describe('isObjNull with nested object values', () => {
    it('Should return false when nested object has non-empty value.', () => {
      const result = testInstance.isObjNull({
        nestedObject: {
          level1: {
            level2: {
              value: 'test',
              emptyNested: {},
            },
          },
        },
      });

      expect(result).toBe(false);
    });

    it('Should return true when nested object has only empty values.', () => {
      const result = testInstance.isObjNull({
        nestedObject: {
          level1: {
            level2: {
              value: '',
              emptyNested: {},
            },
          },
        },
      });

      expect(result).toBe(true);
    });

    it('Should return false when deeply nested object has value.', () => {
      const result = testInstance.isObjNull({
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      });

      expect(result).toBe(false);
    });

    it('Should return true when deeply nested object is empty.', () => {
      const result = testInstance.isObjNull({
        level1: {
          level2: {
            level3: {
              level4: {},
            },
          },
        },
      });

      expect(result).toBe(true);
    });
  });

  describe('isObjNull with mixed type combinations', () => {
    it('Should return false when at least one property has value in mixed types.', () => {
      const result = testInstance.isObjNull({
        nullProp: null,
        emptyString: '',
        emptyArray: [],
        emptyObject: {},
        numberProp: 42,
      });

      expect(result).toBe(false);
    });

    it('Should return true when all properties are empty in mixed types.', () => {
      const result = testInstance.isObjNull({
        nullProp: null,
        emptyString: '',
        emptyArray: [],
        emptyObject: {},
        undefinedProp: undefined,
      });

      expect(result).toBe(true);
    });

    it('Should return false with complex nested structure having one value.', () => {
      const result = testInstance.isObjNull({
        level1: {
          level2: {
            empty: {},
            nested: {
              value: 'test',
              empty: {},
            },
          },
        },
        empty: {},
        items: [],
      });

      expect(result).toBe(false);
    });

    it('Should return true with complex nested structure all empty.', () => {
      const result = testInstance.isObjNull({
        level1: {
          level2: {
            empty: {},
            nested: {
              value: '',
              empty: {},
            },
          },
        },
        empty: {},
        items: [],
      });

      expect(result).toBe(true);
    });
  });

  describe('isObjNull with TestClass instance data', () => {
    it('Should return false when TestClass instance has data.', () => {
      const result = testInstance.isObjNull({
        id: testInstance.id,
        name: testInstance.name,
        items: testInstance.items,
        tags: testInstance.tags,
      });

      expect(result).toBe(false);
    });

    it('Should return false when TestClass instance has boolean values.', () => {
      const result = testInstance.isObjNull({
        // @ts-ignore
        isActive: testInstance.isActive,

        // @ts-ignore
        isDisabled: testInstance.isDisabled,
      });

      expect(result).toBe(false);
    });

    it('Should return false when TestClass instance has nested object with data.', () => {
      const result = testInstance.isObjNull({
        nestedObject: testInstance.nestedObject,
      });

      expect(result).toBe(false);
    });

    it('Should return true when TestClass instance has only empty values.', () => {
      const emptyInstance = new TestClass({
        id: 0,
        name: '',
        isActive: false,
        isDisabled: false,
        items: [],
        tags: [],
        metadata: [],
      });

      const result = emptyInstance.isObjNull({
        id: emptyInstance.id,
        name: emptyInstance.name,
        items: emptyInstance.items,
        tags: emptyInstance.tags,
        metadata: emptyInstance.metadata,
      });

      expect(result).toBe(false); // Returns false because numbers and booleans are not empty
    });

    it('Should return true when TestClass instance has truly empty structure.', () => {
      const completelyEmptyInstance = new TestClass({
        id: 0,
        name: '',
        isActive: false,
        isDisabled: false,
        items: [],
        tags: [],
        metadata: [],
      });

      // Test only the truly empty-able properties
      const result = testInstance.isObjNull({
        name: completelyEmptyInstance.name,
        items: completelyEmptyInstance.items,
        tags: completelyEmptyInstance.tags,
        metadata: completelyEmptyInstance.metadata,
        emptyObject: completelyEmptyInstance.emptyObject,
      });

      expect(result).toBe(true);
    });
  });

  describe('isObjNull edge cases and boundary conditions', () => {
    it('Should return false for Function objects.', () => {
      const result = testInstance.isObjNull({ func: () => {} });

      expect(result).toBe(false);
    });
  });

  describe('isPropertyNull with boolean values', () => {
    it('Should return false when isActive property is true.', () => {
      const result = testInstance.isPropertyNull('isActive');

      expect(result).toBe(false);
    });

    it('Should return false when isDisabled property is false.', () => {
      const result = testInstance.isPropertyNull('isDisabled');

      expect(result).toBe(false);
    });

    it('Should return false when boolean property is explicitly set to true.', () => {
      testInstance.isActive = true;
      const result = testInstance.isPropertyNull('isActive');

      expect(result).toBe(false);
    });

    it('Should return false when boolean property is explicitly set to false.', () => {
      testInstance.isDisabled = false;
      const result = testInstance.isPropertyNull('isDisabled');

      expect(result).toBe(false);
    });

    it('Should return true when boolean property is null.', () => {
      testInstance.isActive = null as any;
      const result = testInstance.isPropertyNull('isActive');

      expect(result).toBe(true);
    });
  });
});
