// this file is me playing around with the code because i can't be bothered to write tests right now

import { none, Option, option, some } from "./option.ts";

// const a: number[] = [];

// const y = some(9).flatMap((x) => option(x + 1));
// console.log(y);

// const doesThisWork = option(a.pop()).map((x) => x + 1);

// doesThisWork.match({
//   some: (x) => console.log(x),
//   none: () => console.log("nope"),
// });

// copied fp-ts example

const double = (n: number): number => n * 2;

export const imperative = (as: ReadonlyArray<number>): string => {
  const head = (as: ReadonlyArray<number>): number => {
    if (as.length === 0) {
      throw new Error();
    }
    return as[0];
  };
  const inverse = (n: number): number => {
    if (n === 0) {
      throw new Error();
    }
    return 1 / n;
  };
  try {
    return `Result is ${inverse(double(head(as)))}`;
  } catch (_) {
    return "no result";
  }
};

export const functional = (as: ReadonlyArray<number>): string => {
  const head = <A>(as: ReadonlyArray<A>): Option<A> =>
    as.length === 0 ? none : some(as[0]);

  const inverse = (x: number): Option<number> => (x === 0 ? none : some(1 / x));

  return head(as)
    .map(double)
    .flatMap(inverse)
    .match({
      some: (x) => `The first element is ${x}`,
      none: () => "The array is empty",
    });
};

console.log(functional([1, 2, 3]));
console.log(imperative([1, 2, 3]));

console.log(functional([]));
console.log(imperative([]));

console.log(functional([0]));
console.log(imperative([0]));
