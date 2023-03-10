interface OptionInterface<T> {
  map<U>(fn: (x: T) => U): Option<U>;
  flatMap<U>(fn: (x: T) => Option<U>): Option<U>;
  forEach(fn: (x: T) => void): void;
  match<U>({ some, none }: { some: (x: T) => U; none: () => U }): U;
  get(): T;
  getOrElse(value: T): T;
  isSome(): boolean;
  isNone(): boolean;
}

export abstract class Option<T> implements OptionInterface<T> {
  public abstract map<U>(fn: (x: T) => U): Option<U>;

  public abstract flatMap<U>(fn: (x: T) => Option<U>): Option<U>;

  public abstract forEach(fn: (x: T) => void): void;

  public abstract match<U>({
    some,
    none,
  }: {
    some: (x: T) => U;
    none: () => U;
  }): U;

  public abstract get(): T;

  public abstract getOrElse(value: T): T;

  public abstract isSome(): boolean;

  public abstract isNone(): boolean;
}

export class Some<T> implements Option<T> {
  constructor(private readonly _value: T) {
    if (this._value === undefined || this._value === null) {
      throw new Error("Value must be not null and not undefined");
    }
  }

  public map<U>(fn: (x: T) => U): Option<U> {
    return new Some(fn(this._value));
  }

  public flatMap<U>(fn: (x: T) => Option<U>): Option<U> {
    return fn(this._value);
  }

  public forEach(fn: (x: T) => void): void {
    fn(this._value);
  }

  // deno-lint-ignore no-unused-vars
  public match = <U>({ some, none }: { some: (x: T) => U; none: () => U }): U =>
    some(this._value);

  public get(): T {
    return this._value;
  }

  public getOrElse(_: T): T {
    return this._value;
  }

  public isSome(): boolean {
    return true;
  }

  public isNone(): boolean {
    return false;
  }
}

export class None<T> implements Option<T> {
  public map<U>(_: (x: T) => U): Option<U> {
    return new None();
  }

  public flatMap<U>(_: (x: T) => Option<U>): Option<U> {
    return new None();
  }

  public forEach(_: (x: T) => void): void {
    return;
  }

  // deno-lint-ignore no-unused-vars
  public match = <U>({ some, none }: { some: (x: T) => U; none: () => U }): U =>
    none();

  public get(): T {
    throw new Error("Cannot get value from None");
  }

  public getOrElse<U>(value: U): U {
    return value;
  }

  public isSome(): boolean {
    return false;
  }

  public isNone(): boolean {
    return true;
  }
}

export const some = <T>(value: T): Option<T> => new Some(value);

export const none: Option<never> = new None();

export const option = <T>(value: T | null | undefined): Option<T> =>
  value === null || value === undefined ? none : some(value);

export const match = <T, U>(
  option: Option<T>,
  { some, none }: { some: (x: T) => U; none: () => U }
): U => option.match({ some, none });

export const get = <T>(option: Option<T>): T => option.get();

export const getOrElse = <T>(option: Option<T>, value: T): T =>
  option.getOrElse(value);
