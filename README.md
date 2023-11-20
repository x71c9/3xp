# 3xp

A typescript library for validating objects.

## Implementation

```typescript
import exp from '3xp';

const obj = {
  foo: 'a',
  boo: 1
};

const schema:exp.Schema = {
  foo: 'string',
  boo: {
    primitive: 'number',
    optional: true
  }
};

exp.asserts(obj, schema);
// If the object doesn't have that schema `asserts` will throw an error.

if(!exp.valid(obj, schema)){
  console.error('Object is not valid');
}
```

## Schema

Example of a schema:
```typescript
const schema:Schema = {
  foo: 'string',
  boo: {
    primitive: 'number',
    optional: true,
  },
  moo: {
    primitive: 'array',
    item: {
      primitive: 'object',
      properties: {
        pippo: 'boolean',
        pluto: 'any'
      }
    }
  },
  poo: {
    primitive: 'string',
    values: ['A', 'B', 'C'],
  }
}
```

The following is the type of the schema:

```typescript
export type Schema = Primitive | ExpandedSchema;

export type ExpandedSchema = {
  primitive: Primitive;
  item?: Schema;
  values?: Values;
  properties?: Properties;
  optional?: boolean;
};

export type Properties = {
  [k: string]: Schema;
};

export type ExpandedProperties = {
  [k: string]: ExpandedSchema;
};

export type Values = (string | number)[];

export const PRIMITIVE = {
  ANY: 'any',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
  NULL: 'null',
  NUMBER: 'number',
  OBJECT: 'object',
  STRING: 'string',
  UNDEFINED: 'undefined',
  UNKNOWN: 'unknown',
};

export type Primitive = ObjectValue<typeof PRIMITIVE>;

type ObjectValue<T> = T[keyof T];
```

## Unix philosophy

This repo try to follow the
[Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy).

## Name

`3xp` stands for experiment, like in
[Human radiation experiments](https://en.wikipedia.org/wiki/Human_radiation_experiments).

## Other related repositories

[`i0n`](https://www.npmjs.com/package/i0n) A typescript library for console logging.

[`r4y`](https://www.npmjs.com/package/r4y) A typescript library for managing child processes.

[`w3i`](https://www.npmjs.com/package/w3i) A typescript library for handling configurations.

