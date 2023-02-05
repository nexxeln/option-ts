An implementation of the Option monad in TypeScript.

## What is the Option monad?

The Option monad allows you to represent the possibility of a value being present or absent. It is a way to deal with null values in a functional way. There are two types of Option values: `Some` and `None`. `Some` represents a value that is present, and `None` represents a value that is absent. 

## Why use the Option monad?

The Option monad makes your code declarative and less verbose. It also makes your code more robust and less error-prone by forcing you to deal with the possibility of a value being absent. 

## Usage

### Creating an Option

You can create an Option by using the `option` function.

```ts
const maybeNumber = option(5);
//     ^? const maybeNumber: Option<number>

const maybeString = option("hello");
//     ^? const maybeString: Option<string>
```

You can also create an Option by using the `some` function which will have the same effect as using the `option` function. You can use the `some` function when you want to make it clear that maybe value is present and the `option` function when you want to take a value and make it an Option. 

```ts
const someNumber = some(5);
//    ^? const maybeNumber: Option<number>

const someString = some("hello");
//   ^? const maybeString: Option<string>
```

### Getting a value from an Option

You can get a value from an Option by using the `get` function. If the Option is `None`, then the function will throw an error. 

```ts
const maybeNumber = option(5);
const five = maybeNumber.get(); // 5

const maybeString = option(undefined);
const hello = maybeString.get(); // throws an error
```

You can also use the `getOrElse` function to get a value from an Option. If the Option is `None`, then the function will return the value that you pass in. 

```ts
const maybeNumber = option(5);
const five = maybeNumber.getOrElse(0); // 5

const maybeString = option(undefined);
const hello = maybeString.getOrElse("hello"); // "hello"
```

### Operating on an Option

There are a number of functions that you can use to operate on an Option.

#### `map`

The `map` function allows you to transform the value inside an Option. If the Option is `None`, then the function will not be called and the result will be `None`. 

```ts
const maybeNumber = option(5).map((x) => x + 1);

console.log(maybeNumber.get()); // 6


const maybeArray = option([1, 2, 3]).map((x) => x.map((y) => y + 1));
console.log(maybeArray.get()); // [2, 3, 4]
```

#### `flatMap`

The `flatMap` function is similar to the `map` function, but it allows you to return an Option from the function that you pass in. It's useful when you want to compose multiple Option values. 

```ts
const withMap = option(4).map((x) => option(x + 5));
//     ^? const withMap: Option<Option<number>>

const withFlatMap = option(4).flatMap((x) => option(x + 5));
//    ^? const withFlatMap: Option<number>
```

#### `forEach`

The `forEach` function allows you to perform a side effect on the value inside an Option. If the Option is `None`, then the function will not be called. 

```ts
const maybeNumber = option(5);
maybeNumber.forEach((x) => console.log(x)); // 5

const maybeString = option(undefined);
maybeString.forEach((x) => console.log(x)); // nothing is logged
```

#### `match`

The `match` function allows you perform pattern matching on an Option. It takes the option and two functions, one for the `Some` case and one for the `None` case. Depending on the value of the Option, the function will call the appropriate function. 

```ts 
const maybeNumber = option(5);

const result = maybeNumber.match({
  some: (x) => x + 1,
  none: () => 0
});

console.log(result); // 6

const arr: number[] = [];
const maybeNumber2 = option(arr.pop());

const result2 = maybeNumber2.match({
  some: (x) => x + 1,
  none: () => 0
});

console.log(result2); // 0
```

### Miscellaneous

#### `isSome`

The `isSome` function allows you to check if an Option is `Some`. 

```ts
const maybeNumber = option(5);
const isSome = maybeNumber.isSome(); // true
```

#### `isNone`

The `isNone` function allows you to check if an Option is `None`. 

```ts
const maybeNumber = option(5);
const isNone = maybeNumber.isNone(); // false
```

## Imperative vs. Declarative

The Option monad allows you to write your code in a declarative way. This means that you are describing what you want to do, rather than how you want to do it. Here's an example taken from the [fp-ts](https://gcanti.github.io/fp-ts) documentation:

```ts
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
    return `The first element is ${inverse(double(head(as)))}`;
  } catch (_) {
    return "No result";
  }
};

export const declarative = (as: ReadonlyArray<number>): string => {
  const head = <A>(as: ReadonlyArray<A>): Option<A> =>
    as.length === 0 ? none : some(as[0]);

  const inverse = (x: number): Option<number> => (x === 0 ? none : some(1 / x));

  return head(as)
    .map(double)
    .flatMap(inverse)
    .match({
      some: (x) => `The first element is ${x}`,
      none: () => "No result",
    });
};

console.log(declarative([1, 2, 3])); // "The first element is 0.5"
console.log(imperative([1, 2, 3])); // "The first element is 0.5"

console.log(declarative([])); // "No result"
console.log(imperative([])); // "No result"
```

## Real world examples

### Chaining and composing options:

```ts
type User = {
  name: string,
  address: {
    street: string,
    zipCode: number
  }
}

const getUser = (): Option<User> =>
  some({
    name: "John Doe",
    address: {
      street: "Main St.",
      zipCode: 12345
    }
  });

const getStreet = (user: User): Option<string> =>
  some(user.address.street);

const getZipCode = (user: User): Option<number> =>
  some(user.address.zipCode);

const userStreet = getUser().flatMap(getStreet);
const userZipCode = getUser().flatMap(getZipCode);

userStreet.match({
  some: street => console.log(`Street: ${street}`),
  none: () => console.log("No street found.")
});

userZipCode.match({
  some: zipCode => console.log(`Zip code: ${zipCode}`),
  none: () => console.log("No zip code found.")
});
```

### Error handling with options:

```ts
const divide = (x: number, y: number): Option<number> =>
  y === 0 ? none : some(x / y);

const result = divide(10, 2);

result.match({
  some: (res) => console.log(`Result: ${res}`),
  none: () => console.log("Cannot divide by zero.")
});
```

### Usage in React:

```tsx
type User = {
  name: string;
  address: {
    street: string;
    zipCode: number;
  };
};

export const App = () => {
  const [user, setUser] = useState<Option<User>>(none);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return (
    <div>
      {user.match({
        some: (user) => (
          <div>
            <h1>{user.name}</h1>
            <p>{user.address.street}</p>
            <p>{user.address.zipCode}</p>
          </div>
        ),
        none: () => <p>Loading...</p>
      })}
    </div>
  );
};
```