import { Monad } from "./utils.ts";

export abstract class Option<T> implements Monad<T> {
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

  public abstract getOrElse(value: T): T;
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

  public getOrElse(_: T): T {
    return this._value;
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

  public getOrElse<U>(value: U): U {
    return value;
  }
}

export const option = <T>(value: T | null | undefined): Option<T> =>
  value === undefined || value === null ? new None() : new Some(value);

export const match = <T, U>(
  option: Option<T>,
  { some, none }: { some: (x: T) => U; none: () => U }
): U => option.match({ some, none });

export const getOrElse = <T>(option: Option<T>, value: T): T =>
  option.getOrElse(value);
