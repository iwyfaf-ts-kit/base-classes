import { BaseDto } from '@iwyfaf-ts-kit/base-classes';
import type { TUser } from '../types/user.types';

export type TUserDtoUpdateRequest = Pick<TUser, 'name' | 'age' | 'score'>;

export type TUserDtoUpdateResponse = TUserDtoUpdateRequest & Pick<TUser, 'config_status'>;

export class UserDtoUpdate
  extends BaseDto<TUserDtoUpdateRequest>
  implements TUserDtoUpdateResponse
{
  public name: TUserDtoUpdateResponse['name'];
  public age: TUserDtoUpdateResponse['age'];
  public score: TUserDtoUpdateResponse['score'];
  public config_status: TUserDtoUpdateResponse['config_status'];

  constructor(attrs: Partial<TUserDtoUpdateResponse> | null = null) {
    super();
    attrs = attrs ?? {};

    this.name = attrs.name ?? null;
    this.age = attrs.age ?? null;
    this.score = attrs.score ?? null;
    this.config_status = attrs.config_status ?? {
      name: null,
      title: null,
      description: null,
    };

    this._initChangeTracker();
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.isObjPropertyNull(this.config_status, 'name') ? null : this.config_status.name,
      age: this.age,
      score: this.score,
    };
  }
}
