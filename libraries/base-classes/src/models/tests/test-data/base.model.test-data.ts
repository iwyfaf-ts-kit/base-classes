import { BaseModel } from '../../base.model';

export class TestClass extends BaseModel {
  public id: number;
  public name: string;
  public isActive: boolean;
  public isDisabled: boolean;
  public emptyObject: Record<string, any>;
  public nestedObject: {
    level1: {
      level2: {
        value: string;
        emptyNested: Record<string, any>;
      };
    };
  };
  public items: string[];
  public tags: string[];
  public metadata: Array<{ key: string; value: any }>;
  public optional?: string;

  constructor(data: {
    id: number;
    name: string;
    isActive: boolean;
    isDisabled: boolean;
    emptyObject?: Record<string, any>;
    nestedObject?: {
      level1: {
        level2: {
          value: string;
          emptyNested: Record<string, any>;
        };
      };
    };
    items?: string[];
    tags?: string[];
    metadata?: Array<{ key: string; value: any }>;
    optional?: string;
  }) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.isActive = data.isActive;
    this.isDisabled = data.isDisabled;
    this.emptyObject = data.emptyObject || {};
    this.nestedObject = data.nestedObject || {
      level1: {
        level2: {
          value: '',
          emptyNested: {},
        },
      },
    };
    this.items = data.items || [];
    this.tags = data.tags || [];
    this.metadata = data.metadata || [];
    this.optional = data.optional;
  }
}
