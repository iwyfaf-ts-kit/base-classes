import type { BaseModelAbstract } from '../types';

export class BaseModel implements BaseModelAbstract {
  public isObjNull(
    obj: Record<
      string | number,
      string | number | Record<string, any> | Array<any> | object | null | undefined
    > | null,
  ): boolean {
    if (!obj) return true;

    function checkValue(v: any): boolean {
      if (v === null || v === undefined) {
        return false;
      }

      if (typeof v === 'string' && v.length === 0) {
        return false;
      }

      if (Array.isArray(v) && v.length === 0) {
        return false;
      }

      if (typeof v === 'object' && !Array.isArray(v)) {
        if (Object.keys(v).length === 0) {
          return false;
        }

        return Object.values(v).some(checkValue);
      }

      return true;
    }

    return !Object.values(obj).some(checkValue);
  }

  public isPropertyNull<Key extends keyof this>(
    property: Key & Exclude<Key, keyof BaseModel>,
  ): boolean {
    const value = this[property];

    if (value === null || value === undefined) {
      return true;
    }

    if ((typeof value as string) === 'string' || Array.isArray(value)) {
      return (value as string | Array<any>).length === 0;
    }

    return false;
  }
}
