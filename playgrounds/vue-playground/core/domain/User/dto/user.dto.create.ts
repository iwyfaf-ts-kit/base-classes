import { BaseDto } from '@iwyfaf-ts-kit/base-classes';
import type { TUser } from '../types/user.types';

export type TUserDtoCreateRequest = Pick<TUser, 'name' | 'age' | 'score'>;

export type TUserDtoCreateResponse = TUserDtoCreateRequest;

export class UserDtoCreate
  extends BaseDto<TUserDtoCreateRequest>
  implements TUserDtoCreateResponse
{
  public name: TUserDtoCreateResponse['name'];
  public age: TUserDtoCreateResponse['age'];
  public score: TUserDtoCreateResponse['score'];

  constructor(attrs: Partial<TUserDtoCreateRequest> | null = null) {
    super();
    attrs = attrs ?? {};

    this.name = attrs.name ?? null;
    this.age = attrs.age ?? null;
    this.score = attrs.score ?? null;
  }

  public toJSON(): TUserDtoCreateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}
