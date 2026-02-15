export class BaseDto<T extends object> {
  private _originalData: Record<string, any> = {};

  public toJSON(): T {
    const result: Record<string, any> = {};

    for (const key in this) {
      if (key !== '_originalData' && typeof this[key] !== 'function') {
        result[key] = this[key];
      }
    }

    return result as T;
  }

  public isObjNull<Obj extends object>(obj: Obj | null): obj is null {
    return obj === null;
  }

  public isObjEmpty<Obj extends object>(obj: Obj | null): obj is null {
    return obj !== null && !Object.keys(obj).length;
  }

  public isObjPropertyNull<Obj extends object, Key extends keyof Obj>(
    obj: Obj | null,
    property: Key,
  ): obj is null {
    return obj === null || obj[property] === null || obj[property] === undefined;
  }

  public isPropertyNull<Key extends keyof this>(
    property: Key & Exclude<Key, keyof BaseDto<T>>,
  ): boolean {
    const value = this[property];

    if (value === null || value === undefined) {
      return true;
    }

    if ((typeof value as string) === 'string' || Array.isArray(value)) {
      return (value as string | any[]).length === 0;
    }

    return false;
  }

  private _deepClone<T>(value: T): T {
    if (value == null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this._deepClone(item)) as unknown as T;
    }

    if (value instanceof Date) {
      return new Date(value.getTime()) as unknown as T;
    }

    const clonedObj: any = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        clonedObj[key] = this._deepClone(value[key]);
      }
    }

    return clonedObj;
  }

  private _isDeepEqual(value1: any, value2: any): boolean {
    // Сравнение примитивов и ссылок
    if (value1 === value2) {
      return true;
    }

    // Проверка на null/undefined
    if (value1 == null || value2 == null) {
      return value1 === value2;
    }

    // Сравнение объектов
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const isArray1 = Array.isArray(value1);
      const isArray2 = Array.isArray(value2);

      // Если один массив, а другой нет
      if (isArray1 !== isArray2) {
        return false;
      }

      if (isArray1 && isArray2) {
        // Сравнение массивов
        if (value1.length !== value2.length) {
          return false;
        }

        for (let i = 0; i < value1.length; i++) {
          if (!this._isDeepEqual(value1[i], value2[i])) {
            return false;
          }
        }
        return true;
      } else {
        // Сравнение объектов
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);

        if (keys1.length !== keys2.length) {
          return false;
        }

        for (const key of keys1) {
          if (!keys2.includes(key)) {
            return false;
          }

          if (!this._isDeepEqual(value1[key], value2[key])) {
            return false;
          }
        }
        return true;
      }
    }

    // Разные типы или примитивы, которые не равны
    return false;
  }

  private _getDirtyPaths(current: any, original: any, path: string = ''): string[] {
    const dirtyPaths: string[] = [];

    if (!this._isDeepEqual(current, original)) {
      if (
        current == null ||
        original == null ||
        typeof current !== 'object' ||
        typeof original !== 'object'
      ) {
        if (path) {
          dirtyPaths.push(path);
        }
      } else {
        const allKeys = new Set([...Object.keys(current || {}), ...Object.keys(original || {})]);

        for (const key of allKeys) {
          const currentValue = current?.[key];
          const originalValue = original?.[key];
          const newPath = path ? `${path}.${key}` : key;

          dirtyPaths.push(...this._getDirtyPaths(currentValue, originalValue, newPath));
        }
      }
    }

    return dirtyPaths;
  }

  private _getDataSnapshot(): Record<string, any> {
    const snapshot: Record<string, any> = {};

    for (const key in this) {
      if (typeof this[key] !== 'function' && !key.startsWith('_') && key !== '_originalData') {
        snapshot[key] = this._deepClone(this[key]);
      }
    }

    return snapshot;
  }

  protected _initChangeTracker(): void {
    this._originalData = this._getDataSnapshot();
  }

  public hasChanged(): boolean {
    const currentData = this._getDataSnapshot();
    const keys = Object.keys(currentData);

    for (const key of keys) {
      if (!this._isDeepEqual(currentData[key], this._originalData[key])) {
        return true;
      }
    }

    return false;
  }

  public getDirtyFields(): Array<string> {
    const currentData = this._getDataSnapshot();
    const dirtyFields: string[] = [];

    for (const key in currentData) {
      const currentValue = currentData[key];
      const originalValue = this._originalData[key];

      const paths = this._getDirtyPaths(currentValue, originalValue, key);
      dirtyFields.push(...paths);
    }

    return dirtyFields;
  }

  public commitChanges(): void {
    this._originalData = this._getDataSnapshot();
  }

  public resetChanges(): void {
    for (const key in this._originalData) {
      if (this.hasOwnProperty(key)) {
        (this as any)[key] = this._deepClone(this._originalData[key]);
      }
    }

    this._initChangeTracker();
  }
}
