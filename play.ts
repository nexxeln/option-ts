// this file is me playing around with the code because i can't be bothered to write tests right now

import { getOrElse, match, option } from "./option.ts";

const a: number[] = [];

const doesThisWork = option(a.pop()).map((x) => x + 1);

// match(doesThisWork, {
//   some: (x) => console.log(x),
//   none: () => console.log("nope"),
// });

const hi = option(1).match({
  some: (x) => x,
  none: () => 0,
});

console.log(hi);
