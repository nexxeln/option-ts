export interface Monad<T> {
  map<U>(fn: (value: T) => U): Monad<U>;
  flatMap<U>(fn: (value: T) => Monad<U>): Monad<U>;
  forEach(fn: (value: T) => void): void;
}
