# Core Base Classes

Базовые классы для работы с моделями и DTO в TypeScript-проектах.

## Работа с моделями (Models)

Класс `BaseModel` предоставляет функционал для работы с моделями данных.

### Особенности реализации

- Глубокая рекурсивная проверка вложенных структур
- Поддержка всех основных типов данных (строки, числа, массивы, объекты)
- Строгая типизация с использованием TypeScript Generics

### Проверка данных

Класс содержит несколько методов для различных проверок данных моделей.

#### `isObjNull()`

Проверяет, является ли переданный объект `null`, `undefined` или пустым.

Этот метод выполняет глубокую проверку объекта. Он считается "нулевым" (`null`), если проверяемые свойства объекта 
равны `null`, `undefined`, если объект без собственных перечисляемых свойств или если массив пустой.

Пример использования:
```typescript
import { BaseModel } from '@iwyfaf-ts-kit/base-classes';
import type { TUser } from '../types/user.types.ts';

export class UserModel extends BaseModel implements TUser {
  public id: number | null = null;
  public name: string | null = null;
  public age: number | null = null;

  constructor(attrs: TUser | null = null) {
    super();

    if (!attrs) return;

    this.id = attrs['id'] ?? null;
    this.name = attrs['name'] ?? null;
    this.age = attrs['age'] ?? null;
  }
  
  public isUserNull(): boolean {
    return this.isObjNull({
      id: this.id,
      name: this.name,
      age: this.age,
    });
  }
}
```

#### `isPropertyNull()`

Проверяет, является ли указанное свойство текущего экземпляра класса `null` или `undefined`.

Этот метод предназначен для безопасной проверки значений свойств внутри класса. Он использует TypeScript generics для
обеспечения типобезопасности, позволяя проверять только те свойства, которые не являются методами.

Пример использования:
```typescript
import { BaseModel } from '@iwyfaf-ts-kit/base-classes';
import type { TUser } from '../types/user.types.ts';

export class UserModel extends BaseModel implements TUser {
  public id: number | null = null;
  public name: string | null = null;
  public age: number | null = null;

  constructor(attrs: TUser | null = null) {
    super();

    if (!attrs) return;

    this.id = attrs['id'] ?? null;
    this.name = attrs['name'] ?? null;
    this.age = attrs['age'] ?? null;
  }
  
  public isUserNull(): boolean {
    return this.isObjNull({
      id: this.id,
      name: this.name,
      age: this.age,
    });
  }

  public isAgeNull(): boolean {
    return this.isPropertyNull('age');
  }
}
```

### Реализация класса

Пакет поставляет абстрактный класс `BaseModelAbstract` для вашей собственной реализации:

```typescript
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
```

## Работа с DTO (BaseDto)

Класс `BaseDto` предоставляет расширенный функционал для работы с Data Transfer Objects:

### Особенности реализации

- Глубокое сравнение объектов через `_isDeepEqual`
- Поддержка сложных структур данных
- Эффективное отслеживание изменений в массивах и объектах

### Сериализация

Класс содержит метод для сериализации данных DTO.

#### `toJSON()`

Реализует сериализация данных. Преобразует объект DTO в простой JavaScript-объект типа `T`. Подходит для преобразования
данных под структуру, которую ожидает сервер.

Пример использования:
```typescript
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
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}
```

### Проверка данных

Класс содержит несколько методов для различных проверок данных DTO.

#### `isObjNull()`

Проверяет, является ли переданный объект `null` или `undefined`.

Пример использования:
```typescript
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
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.isObjNull(this.config_status) ? null : this.score, // this.config_status не является `null` или `undefined`
    };
  }
}
```

#### `isObjEmpty()`

Проверяет, является ли переданный объект "пустым". Пустым считается объект, который равен `null`, `undefined` или не 
содержит собственных перечисляемых свойств.

Пример использования:
```typescript
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
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.isObjEmpty(this.config_status) ? null : this.score, // this.config_status не является пустым
    };
  }
}
```

#### `isObjPropertyNull()`

Проверяет, является ли конкретное свойство указанного объекта `null` или `undefined`.

Пример использования:
```typescript
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
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.isObjPropertyNull(this.config_status, 'name') ? null : this.config_status.name, // В name будет передано значение this.config_status.name если оно указано
      age: this.age,
      score: this.isObjPropertyNull(this.config_status, 'name') ? null : this.score, // В score будет передано значение this.score, если указан this.config_status.name
    };
  }
}
```

#### `isPropertyNull()`

Проверяет, является ли указанное свойство объекта `null` или `undefined`.

Пример использования:
```typescript
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
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.isPropertyNull('name') ? null : this.score, // В score будет передано значение this.score если заполнено поле name
    };
  }
}
```

### Трекинг изменений

Класс содержит несколько методов для работы с трекингом изменений данных DTO.

#### `_initChangeTracker()`

Инициализирует внутренний трекер изменений для объекта DTO. Этот метод должен вызываться в конструкторе 
класса-наследника или в момент создания DTO.

Пример использования:
```typescript
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

    this._initChangeTracker(); // Инициализация трекинга изменений данных DTO
  }

  public toJSON(): TUserDtoUpdateRequest {
    return {
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}
```

#### `hasChanged()`

Проверяет, были ли какие-либо свойства DTO изменены после его создания или последнего сброса.

Пример использования:
```typescript
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
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}

const dto = new UserDtoUpdate({ name: 'Alice' });
dto.name = 'Bob';
dto.hasChanged(); // true 
```

#### `getDirtyFields()`

Возвращает массив имен свойств, которые были изменены.

Пример использования:
```typescript
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
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}

const dto = new UserDtoUpdate({ name: 'Alice' });
dto.name = 'Bob';
dto.getDirtyFields(); // ['name']
```

#### `commitChanges()`

Фиксирует текущие изменения в исходном снимке данных. Текущие значения свойств становятся новыми исходными значениями.

Пример использования:
```typescript
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
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}

const dto = new UserDtoUpdate({ name: 'Alice' });
dto.name = 'Bob';
dto.commitChanges();
dto.hasChanged(); // false
dto.getDirtyFields(); // []
```

#### `resetChanges()`

Сбрасывает состояние трекера изменений, делая объект "неизмененным". Текущие значения свойств становятся новыми 
исходными значениями.

Пример использования:
```typescript
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
      name: this.name,
      age: this.age,
      score: this.score,
    };
  }
}

const dto = new UserDtoUpdate({ name: 'Alice' });
dto.name = 'Bob';
dto.resetChanges();
dto.hasChanged(); // false
dto.getDirtyFields(); // []
```
