import { BaseModel } from '@iwyfaf-ts-kit/base-classes';
import type { TUser } from '../types/user.types.ts';

export class UserModel extends BaseModel implements TUser {
  public id: number | null = null;
  public name: string | null = null;
  public age: number | null = null;
  public email: string | null = null;
  public phoneNumber: string | null = null;
  public score: number | null = null;
  public isActive: boolean = false;
  public config_status: TUser['config_status'] = {
    name: null,
    title: null,
    description: null,
  };
  public last_error_details: TUser['last_error_details'] = {};

  constructor(attrs: TUser | null = null) {
    super();

    if (!attrs) return;

    this.id = attrs['id'] ?? null;
    this.name = attrs['name'] ?? null;
    this.age = attrs['age'] ?? null;
    this.email = attrs['email'] ?? null;
    this.phoneNumber = attrs['phoneNumber'] ?? null;
    this.score = attrs['score'] ?? null;
    this.isActive = attrs['isActive'] ?? false;
    this.config_status = attrs['config_status'] ?? {
      name: null,
      title: null,
      description: null,
    };
    this.last_error_details = attrs['last_error_details'] ?? {};
  }

  /**
   * Проверяет модель юзера на пустоту.
   *
   * @returns {boolean}
   */
  public isUserNull(): boolean {
    return this.isObjNull({
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
      phoneNumber: this.phoneNumber,
      score: this.score,
      config_status: this.config_status,
      last_error_details: this.last_error_details,
    });
  }

  public isAgeNull(): boolean {
    return this.isPropertyNull('age');
  }
}
