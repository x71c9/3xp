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
// If the object doesn't have that schema, the method `asserts` throws an error.

if(!exp.is_valid(obj, schema)){
  console.error('Object is not valid');
}
```

## TypeScript Type Inference

You can use `SchemaType` to infer TypeScript types from your schemas. This provides full type safety at compile time based on your runtime schema definitions.

```typescript
import exp from '3xp';

// Define your schema with 'as const' to preserve literal types
const schema = {
  primitive: 'object',
  properties: {
    name: 'string',
    age: 'number',
    email: {
      primitive: 'string',
      optional: true
    }
  }
} as const;

// Infer the TypeScript type from the schema
type User = exp.SchemaType<typeof schema>;
// User is: { name: string; age: number; email?: string }

// Now you have full type safety
const user: User = {
  name: 'John',
  age: 30
  // email is optional
};

// TypeScript will catch errors at compile time
const invalidUser: User = {
  name: 'Jane',
  age: 'not a number' // Error: Type 'string' is not assignable to type 'number'
};
```

### Important Notes

- **Use `as const`**: You must use `as const` assertion on your schema to preserve literal types
- **Works with all schema features**: Supports primitives, objects, arrays, optional fields, and enum values
- **Type-safe enums**: The `values` property creates proper union types

Example with enum values:

```typescript
const statusSchema = {
  primitive: 'string',
  values: ['active', 'inactive', 'pending'] as const
} as const;

type Status = exp.SchemaType<typeof statusSchema>;
// Status is: 'active' | 'inactive' | 'pending'
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

