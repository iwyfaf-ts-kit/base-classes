/**
 * Абстрактный интерфейс, определяющий базовые методы для работы с различными моделям.
 *
 * Этот интерфейс служит контрактом для классов, которым необходимо реализовать различную
 * логику для работы с моделями данных.
 */
export interface BaseModelAbstract {
  /**
   * Проверяет, является ли переданный объект `null`, `undefined` или пустым.
   *
   * Этот метод выполняет глубокую проверку объекта. Он считается "нулевым" (null),
   * если проверяемые свойства объекта равны `null`, `undefined`, если объект без собственных
   * перечисляемых свойств или если массив пустой.
   *
   * @param obj - Объект для проверки. Может быть объектом, `null` или `undefined`.
   * Объект может содержать свойства со значениями типов: `string`, `number`, вложенные объекты,
   * массивы, а также `null` и `undefined`.
   *
   * @returns {boolean} Возвращает `true`, если объект считается "нулевым", иначе `false`.
   */
  isObjNull(
    obj: Record<
      string | number,
      string | number | Record<string, any> | Array<any> | null | undefined
    > | null,
  ): boolean;

  /**
   * Проверяет, является ли указанное свойство текущего экземпляра класса `null` или `undefined`.
   *
   * Этот метод предназначен для безопасной проверки значений свойств внутри класса.
   * Он использует TypeScript generics для обеспечения типобезопасности, позволяя
   * проверять только те свойства, которые не являются методами.
   *
   * @template Key - Обобщенный тип, ограниченный ключами свойств текущего экземпляра (`this`).
   *
   * @param property - Имя свойства для проверки. Должно быть ключом экземпляра класса, за
   * исключением методов.
   *
   * @returns {boolean} Возвращает `true`, если значение свойства равно `null` или `undefined`,
   * иначе `false`.
   *
   * @example
   * ```typescript
   * class User extends BaseModel {
   *   public name: string | null = null;
   *   public age?: number;
   *   public greet() { console.log('Hi!'); }
   * }
   *
   * const user = new User();
   *
   * // Проверка свойств
   * user.isPropertyNull('name'); // true
   * user.isPropertyNull('age'); // true
   *
   * user.name = 'Alice';
   * user.isPropertyNull('name'); // false
   *
   * // Ошибка компиляции: 'greet' является методом, а не свойством
   * // user.isPropertyNull('greet');
   * ```
   */
  isPropertyNull<Key extends keyof this>(property: Key & Exclude<Key, keyof BaseModel>): boolean;
}

/**
 * Базовая реализация класса с методами для проверки объектов и свойств на `null`.
 *
 * Этот класс предоставляет стандартную реализацию методов, описанных в интерфейсе
 * `BaseModelAbstract`. Он предназначен для наследования другими классами моделей,
 * чтобы они могли использовать готовую логику проверки данных.
 *
 * @example
 * ```typescript
 * class Product extends BaseModel {
 *   constructor(
 *     public id: number,
 *     public name: string | null,
 *     public details?: Record<string, any>
 *   ) {
 *     super();
 *   }
 * }
 *
 * const product = new Product(1, null);
 * console.log(product.isPropertyNull('name')); // true
 * console.log(product.isPropertyNull('details')); // true
 * ```
 *
 * @extends BaseModelAbstract
 */
export declare class BaseModel implements BaseModelAbstract {
  /**
   * Проверяет, является ли переданный объект `null`, `undefined` или пустым.
   *
   * Этот метод выполняет глубокую проверку объекта. Он считается "нулевым" (null),
   * если проверяемые свойства объекта равны `null`, `undefined`, если объект без собственных
   * перечисляемых свойств или если массив пустой.
   *
   * @param obj - Объект для проверки. Может быть объектом, `null` или `undefined`.
   * Объект может содержать свойства со значениями типов: `string`, `number`, вложенные объекты,
   * массивы, а также `null` и `undefined`.
   *
   * @returns {boolean} Возвращает `true`, если объект считается "нулевым", иначе `false`.
   */
  public isObjNull(
    obj: Record<
      string | number,
      string | number | Record<string, any> | Array<any> | null | undefined
    > | null,
  ): boolean;

  /**
   * Проверяет, является ли указанное свойство текущего экземпляра класса `null` или `undefined`.
   *
   * Этот метод предназначен для безопасной проверки значений свойств внутри класса.
   * Он использует TypeScript generics для обеспечения типобезопасности, позволяя
   * проверять только те свойства, которые не являются методами.
   *
   * @template Key - Обобщенный тип, ограниченный ключами свойств текущего экземпляра (`this`).
   *
   * @param property - Имя свойства для проверки. Должно быть ключом экземпляра класса, за
   * исключением методов.
   *
   * @returns {boolean} Возвращает `true`, если значение свойства равно `null` или `undefined`,
   * иначе `false`.
   *
   * @example
   * ```typescript
   * class User extends BaseModel {
   *   public name: string | null = null;
   *   public age?: number;
   *   public greet() { console.log('Hi!'); }
   * }
   *
   * const user = new User();
   *
   * // Проверка свойств
   * user.isPropertyNull('name'); // true
   * user.isPropertyNull('age'); // true
   *
   * user.name = 'Alice';
   * user.isPropertyNull('name'); // false
   *
   * // Ошибка компиляции: 'greet' является методом, а не свойством
   * // user.isPropertyNull('greet');
   * ```
   */
  public isPropertyNull<Key extends keyof this>(
    property: Key & Exclude<Key, keyof BaseModel>,
  ): boolean;
}

/**
 * Абстрактный интерфейс, определяющий базовый набор методов для всех DTO (Data Transfer Object).
 *
 * @template T - Тип объекта, в который преобразуется DTO методом `toJSON()`.
 *
 * @example
 * ```ts
 * interface IUserDto extends BaseDtoAbstract<UserData> {
 *   id: number;
 *   name: string;
 * }
 *
 * const user: UserDto = ...;
 * const jsonData: UserData = user.toJSON();
 * const hasChanged: boolean = user.hasChanged();
 * ```
 */
export interface BaseDtoAbstract<T extends object> {
  /**
   * Реализует сериализация данных. Преобразует объект DTO в простой JavaScript-объект типа T.
   * Подходит для преобразования данных под структуру, которую ожидает сервер.
   *
   * @returns {T} Простой объект, содержащий данные DTO.
   */
  toJSON(): T;

  /**
   * Проверяет, является ли переданный объект `null` или `undefined`.
   *
   * @template Obj - Тип проверяемого объекта.
   *
   * @param {Obj | null} obj - Объект, который необходимо проверить.
   *
   * @returns {boolean} `true`, если объект равен null или undefined, иначе `false`.
   */
  isObjNull<Obj extends object>(obj: Obj | null): obj is null;

  /**
   * Проверяет, является ли переданный объект "пустым". Пустым считается объект, который равен
   * `null`, `undefined` или не содержит собственных перечисляемых свойств.
   *
   * @template Obj - Тип проверяемого объекта.
   *
   * @param {Obj | null} obj - Объект, который необходимо проверить на пустоту.
   *
   * @returns {boolean} `true`, если объект пуст, иначе `false`.
   */
  isObjEmpty<Obj extends object>(obj: Obj | null): obj is null;

  /**
   * Проверяет, является ли конкретное свойство указанного объекта `null` или `undefined`.
   *
   * @template Obj - Тип объекта, свойство которого проверяется.
   * @template Key - Тип ключа (имени свойства) в объекте Obj.
   *
   * @param {Obj | null} obj - Объект, свойство которого нужно проверить.
   * @param {Key} property - Имя свойства для проверки.
   *
   * @returns {boolean} `true`, если объект или его свойство равны null/undefined, иначе `false`.
   */
  isObjPropertyNull<Obj extends object, Key extends keyof Obj>(
    obj: Obj | null,
    property: Key,
  ): obj is null;

  /**
   * Проверяет, является ли указанное свойство объекта `null` или `undefined`.
   *
   * @template Key - Тип ключа (имени свойства) текущего объекта DTO.
   *
   * @param {Key} property - Имя свойства, которое необходимо проверить на null.
   *
   * @returns {boolean} `true`, если свойство равно `null` или `undefined`, иначе `false`.
   */
  isPropertyNull<Key extends keyof this>(property: Key & Exclude<Key, keyof BaseDto<T>>): boolean;

  /**
   * Инициализирует внутренний трекер изменений для объекта DTO. Этот метод должен вызываться в
   * конструкторе класса-наследника или в момент создания DTO.
   */
  _initChangeTracker(): void;

  /**
   * Проверяет, были ли какие-либо свойства DTO изменены после его создания или последнего сброса.
   *
   * @returns {boolean} `true`, если объект был изменен, иначе `false`.
   */
  hasChanged(): boolean;

  /**
   * Возвращает массив имен свойств, которые были изменены.
   *
   * @returns {Array<string>} Массив строк с именами "грязных" (измененных) полей.
   */
  getDirtyFields(): Array<string>;

  /**
   * Фиксирует текущие изменения в исходном снимке данных. Текущие значения свойств становятся
   * новыми исходными значениями.
   */
  commitChanges(): void;

  /**
   * Сбрасывает состояние трекера изменений, делая объект "неизмененным". Текущие значения свойств
   * становятся новыми исходными значениями.
   */
  resetChanges(): void;
}

/**
 * Базовая реализация класса DTO, предоставляющая стандартную функциональность для сериализации,
 * проверки свойств и отслеживания изменений.
 *
 * @template T - Тип объекта, в который преобразуется DTO методом `toJSON()`.
 *
 * @example
 * ```ts
 * class UserDto extends BaseDto<UserData> {
 *   public id: number;
 *   public name: string;
 *
 *   constructor(data: UserData) {
 *     super();
 *     this.id = data.id;
 *     this.name = data.name;
 *     this._initChangeTracker();
 *   }
 * }
 *
 * const user = new UserDto({ id: 1, name: 'Alice' });
 * console.log(user.hasChanged()); // false
 *
 * user.name = 'Bob';
 * console.log(user.hasChanged()); // true
 * console.log(user.getDirtyFields()); // ['name']
 *
 * const json = user.toJSON(); // { id: 1, name: 'Bob' }
 * ```
 */
export declare class BaseDto<T extends object> {
  /**
   * Реализует сериализация данных. Преобразует объект DTO в простой JavaScript-объект типа T.
   * Подходит для преобразования данных под структуру, которую ожидает сервер.
   *
   * @returns {T} Простой объект, содержащий данные DTO.
   */
  toJSON(): T;

  /**
   * Проверяет, является ли переданный объект `null` или `undefined`.
   *
   * @template Obj - Тип проверяемого объекта.
   *
   * @param {Obj | null} obj - Объект, который необходимо проверить.
   *
   * @returns {boolean} `true`, если объект равен null или undefined, иначе `false`.
   */
  isObjNull<Obj extends object>(obj: Obj | null): obj is null;

  /**
   * Проверяет, является ли переданный объект "пустым". Пустым считается объект, который равен
   * `null`, `undefined` или не содержит собственных перечисляемых свойств.
   *
   * @template Obj - Тип проверяемого объекта.
   *
   * @param {Obj | null} obj - Объект, который необходимо проверить на пустоту.
   *
   * @returns {boolean} `true`, если объект пуст, иначе `false`.
   */
  isObjEmpty<Obj extends object>(obj: Obj | null): obj is null;

  /**
   * Проверяет, является ли конкретное свойство указанного объекта `null` или `undefined`.
   *
   * @template Obj - Тип объекта, свойство которого проверяется.
   * @template Key - Тип ключа (имени свойства) в объекте Obj.
   *
   * @param {Obj | null} obj - Объект, свойство которого нужно проверить.
   * @param {Key} property - Имя свойства для проверки.
   *
   * @returns {boolean} `true`, если объект или его свойство равны null/undefined, иначе `false`.
   */
  isObjPropertyNull<Obj extends object, Key extends keyof Obj>(
    obj: Obj | null,
    property: Key,
  ): obj is null;

  /**
   * Проверяет, является ли указанное свойство объекта `null` или `undefined`.
   *
   * @template Key - Тип ключа (имени свойства) текущего объекта DTO.
   *
   * @param {Key} property - Имя свойства, которое необходимо проверить на null.
   *
   * @returns {boolean} `true`, если свойство равно `null` или `undefined`, иначе `false`.
   */
  isPropertyNull<Key extends keyof this>(property: Key & Exclude<Key, keyof BaseDto<T>>): boolean;

  /**
   * Инициализирует внутренний трекер изменений для объекта DTO. Этот метод должен вызываться в
   * конструкторе класса-наследника или в момент создания DTO.
   */
  protected _initChangeTracker(): void;

  /**
   * Проверяет, были ли какие-либо свойства DTO изменены после его создания или последнего сброса.
   *
   * @returns {boolean} `true`, если объект был изменен, иначе `false`.
   */
  public hasChanged(): boolean;

  /**
   * Возвращает массив имен свойств, которые были изменены.
   *
   * @returns {Array<string>} Массив строк с именами "грязных" (измененных) полей.
   */
  public getDirtyFields(): Array<string>;

  /**
   * Фиксирует текущие изменения в исходном снимке данных. Текущие значения свойств становятся
   * новыми исходными значениями.
   */
  public commitChanges(): void;

  /**
   * Сбрасывает состояние трекера изменений, делая объект "неизмененным". Текущие значения свойств
   * становятся новыми исходными значениями.
   */
  public resetChanges(): void;
}
