import { BaseModelAbstract } from '@iwyfaf-ts-kit/base-classes';

export class CustomBaseModel implements BaseModelAbstract {
  isObjNull(
    obj: Record<
      string | number,
      string | number | Record<string, any> | Array<any> | null | undefined
    > | null,
  ): boolean {
    return false;
  }

  isPropertyNull<Key extends keyof this>(
    property: Key & Exclude<Key, keyof CustomBaseModel>,
  ): boolean {
    return false;
  }
}
