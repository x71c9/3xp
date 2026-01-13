# 3xp

A TypeScript library for runtime object validation with compile-time type inference.

## Overview

`3xp` provides a simple, type-safe way to validate JavaScript objects against schemas at runtime while automatically inferring TypeScript types at compile time. Define your schema once, and get both runtime validation and static type checking.

**Key Features:**

- **Runtime Validation**: Validate objects against schemas with clear error messages
- **Type Inference**: Automatically derive TypeScript types from your schemas using `SchemaType<T>`
- **Type Guards**: Use `isValid` for type-safe conditional checks
- **Flexible Validation**: Choose strict mode (exact match) or permissive mode (allow extra properties)
- **Schema Definition**: Support for primitives, objects, arrays, optional fields, and enum values
- **Lightweight**: Extremely minimal dependencies with low runtime overhead

## Installation

```bash
npm install 3xp
```

## Quick Start

```typescript
import exp from '3xp';

const obj = {
  foo: 'a',
  boo: 1
};

const schema: exp.Schema = {
  primitive: 'object',
  properties: {
    foo: 'string', // Shorthand for primitive type
    boo: {
      primitive: 'number', // Extended format with options
      optional: true
    }
  }
} as const;

exp.ensure(obj, schema);
// If the object doesn't have that schema, the method `ensure` throws an error.

if(!exp.isValid(obj, schema)){
  console.error('Object is not valid');
}
```

## Schema

Example of a schema:
```typescript
const schema: exp.Schema = {
  primitive: 'object',
  properties: {
    foo: 'string', // Shorthand: primitive type directly
    boo: {
      primitive: 'number', // Extended format with additional options
      optional: true,
    },
    moo: {
      primitive: 'array',
      item: {
        primitive: 'object',
        properties: {
          pippo: 'boolean', // Shorthand
          pluto: 'any' // Shorthand
        }
      }
    },
    poo: {
      primitive: 'string',
      values: ['A', 'B', 'C'], // Enum values create union types
    }
  }
} as const;
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

### Exact Mode

By default, validation is strict and does not allow additional properties not defined in the schema. You can disable this behavior by setting the `exact` parameter to `false`:

```typescript
import exp from '3xp';

const schema: exp.Schema = {
  primitive: 'object',
  properties: {
    foo: 'string', // Shorthand for primitive type
    boo: 'number'
  }
} as const;

// This will throw an error (extra property 'bar')
const obj1 = { foo: 'a', boo: 1, bar: 'extra' };
exp.ensure(obj1, schema); // Error: No additional attributes are permitted

// This will pass (exact mode disabled)
const obj2 = { foo: 'a', boo: 1, bar: 'extra' };
exp.ensure(obj2, schema, false); // OK - extra properties are ignored

// Works with isValid too
if(exp.isValid(obj2, schema, false)){
  console.log('Valid (with extra properties allowed)');
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

