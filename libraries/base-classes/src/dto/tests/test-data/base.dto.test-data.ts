import { BaseDto } from '../../base.dto';

export class TestUserDto extends BaseDto<{ id: number; name: string; tags: string[] }> {
  public id: number;
  public name: string;
  public tags: string[];

  constructor(data: { id: number; name: string; tags: string[] }) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.tags = data.tags;

    this._initChangeTracker();
  }
}
