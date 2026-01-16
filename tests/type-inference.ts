/**
 * TypeScript type inference test for all primitives
 *
 * This file tests that all primitives correctly infer TypeScript types.
 * If there are any type errors, tsc will fail during compilation.
 */

import * as exp from '../src/main';

// =============================================================================
// Test 1: All primitive types (shorthand syntax)
// =============================================================================
export const allPrimitivesSchema = {
  primitive: 'object',
  properties: {
    str: 'string',
    num: 'number',
    bool: 'boolean',
    date: 'date',
    nullVal: 'null',
    undefinedVal: 'undefined',
    anyVal: 'any',
    unknownVal: 'unknown',
    arr: 'array',
    obj: 'object'
  }
} as const;

export type AllPrimitivesType = exp.SchemaType<typeof allPrimitivesSchema>;

export const validAllPrimitives: AllPrimitivesType = {
  str: 'hello',
  num: 42,
  bool: true,
  date: new Date(),
  nullVal: null,
  undefinedVal: undefined,
  anyVal: 'anything',
  unknownVal: {x: 1},
  arr: [1, 2, 3],
  obj: {key: 'value'}
};

// =============================================================================
// Test 2: Optional fields for all types
// =============================================================================
export const optionalSchema = {
  primitive: 'object',
  properties: {
    reqString: 'string',
    optString: {primitive: 'string', optional: true},
    optNumber: {primitive: 'number', optional: true},
    optBoolean: {primitive: 'boolean', optional: true},
    optDate: {primitive: 'date', optional: true},
    optArray: {primitive: 'array', optional: true},
    optObject: {primitive: 'object', optional: true}
  }
} as const;

export type OptionalType = exp.SchemaType<typeof optionalSchema>;

export const validOptional1: OptionalType = {
  reqString: 'required',
  optString: 'present'
};

export const validOptional2: OptionalType = {
  reqString: 'required'
  // All optional fields omitted
};

// =============================================================================
// Test 3: Arrays of different types
// =============================================================================
export const arraySchema = {
  primitive: 'object',
  properties: {
    strings: {primitive: 'array', item: 'string'},
    numbers: {primitive: 'array', item: 'number'},
    booleans: {primitive: 'array', item: 'boolean'},
    dates: {primitive: 'array', item: 'date'},
    objects: {
      primitive: 'array',
      item: {
        primitive: 'object',
        properties: {
          id: 'number',
          name: 'string'
        }
      }
    }
  }
} as const;

export type ArrayType = exp.SchemaType<typeof arraySchema>;

export const validArrays: ArrayType = {
  strings: ['a', 'b', 'c'],
  numbers: [1, 2, 3],
  booleans: [true, false, true],
  dates: [new Date(), new Date()],
  objects: [{id: 1, name: 'one'}, {id: 2, name: 'two'}]
};

// =============================================================================
// Test 4: Nested objects with all types
// =============================================================================
export const nestedSchema = {
  primitive: 'object',
  properties: {
    user: {
      primitive: 'object',
      properties: {
        id: 'number',
        name: 'string',
        active: 'boolean',
        createdAt: 'date',
        metadata: {
          primitive: 'object',
          properties: {
            lastLogin: 'date',
            preferences: 'object'
          }
        }
      }
    }
  }
} as const;

export type NestedType = exp.SchemaType<typeof nestedSchema>;

export const validNested: NestedType = {
  user: {
    id: 1,
    name: 'John',
    active: true,
    createdAt: new Date(),
    metadata: {
      lastLogin: new Date(),
      preferences: {theme: 'dark'}
    }
  }
};

// =============================================================================
// Test 5: Enum values
// =============================================================================
export const enumSchema = {
  primitive: 'object',
  properties: {
    status: {
      primitive: 'string',
      values: ['active', 'inactive', 'pending'] as const
    },
    priority: {
      primitive: 'number',
      values: [1, 2, 3] as const
    },
    tags: {
      primitive: 'array',
      item: 'string',
      values: ['bug', 'feature', 'docs'] as const
    }
  }
} as const;

export type EnumType = exp.SchemaType<typeof enumSchema>;

export const validEnum: EnumType = {
  status: 'active',
  priority: 2,
  tags: ['bug', 'feature']
};

// =============================================================================
// Test 6: Complex real-world schema
// =============================================================================
export const complexSchema = {
  primitive: 'object',
  properties: {
    id: 'number',
    title: 'string',
    description: {primitive: 'string', optional: true},
    published: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
    deletedAt: {primitive: 'date', optional: true},
    author: {
      primitive: 'object',
      properties: {
        id: 'number',
        name: 'string',
        email: 'string',
        verified: 'boolean'
      }
    },
    tags: {primitive: 'array', item: 'string'},
    comments: {
      primitive: 'array',
      item: {
        primitive: 'object',
        properties: {
          id: 'number',
          text: 'string',
          createdAt: 'date',
          userId: 'number'
        }
      }
    },
    metadata: 'object'
  }
} as const;

export type ComplexType = exp.SchemaType<typeof complexSchema>;

export const validComplex: ComplexType = {
  id: 1,
  title: 'Blog Post',
  description: 'A test post',
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    id: 42,
    name: 'Jane Doe',
    email: 'jane@example.com',
    verified: true
  },
  tags: ['typescript', 'validation'],
  comments: [
    {id: 1, text: 'Great post!', createdAt: new Date(), userId: 10},
    {id: 2, text: 'Thanks!', createdAt: new Date(), userId: 42}
  ],
  metadata: {views: 100, likes: 5}
};

// =============================================================================
// Test 7: Type-specific method access
// =============================================================================

// String methods
export const str: string = validAllPrimitives.str;
export const upperStr: string = str.toUpperCase();

// Number methods
export const num: number = validAllPrimitives.num;
export const fixedNum: string = num.toFixed(2);

// Boolean operations
export const bool: boolean = validAllPrimitives.bool;
export const notBool: boolean = !bool;

// Date methods
export const date: Date = validAllPrimitives.date;
export const timestamp: number = date.getTime();
export const isoString: string = date.toISOString();
export const year: number = date.getFullYear();

// Array methods
export const arr: any[] = validAllPrimitives.arr;
export const arrLength: number = arr.length;

// Object access
export const obj: Record<string, any> = validAllPrimitives.obj;
export const objKeys: string[] = Object.keys(obj);

// =============================================================================
// Test 8: Optional type narrowing
// =============================================================================
export const optDate = validOptional2.optDate;
export let optTimestamp: number | undefined;
if (optDate !== undefined) {
  optTimestamp = optDate.getTime();
}

export const optString = validOptional2.optString;
export let optUpper: string | undefined;
if (optString !== undefined) {
  optUpper = optString.toUpperCase();
}

// =============================================================================
// Test 9: Array type inference
// =============================================================================
export const stringArr: string[] = validArrays.strings;
export const firstString: string = stringArr[0];

export const dateArr: Date[] = validArrays.dates;
export const firstDate: Date = dateArr[0];
export const firstDateTimestamp: number = firstDate.getTime();

// =============================================================================
// Commented out type errors (would fail compilation if uncommented)
// =============================================================================

// Type mismatch errors:
// const invalidString: AllPrimitivesType = {...validAllPrimitives, str: 123};
// const invalidNumber: AllPrimitivesType = {...validAllPrimitives, num: 'string'};
// const invalidBoolean: AllPrimitivesType = {...validAllPrimitives, bool: 'yes'};
// const invalidDate: AllPrimitivesType = {...validAllPrimitives, date: '2023-01-01'};

// Missing required field:
// const invalidRequired: OptionalType = {};

// Wrong enum value:
// const invalidEnum: EnumType = {...validEnum, status: 'unknown'};

// Array type mismatch:
// const invalidArray: ArrayType = {...validArrays, dates: ['string', 'array']};

console.log('Type inference test completed successfully!');
console.log('All primitive types are correctly inferred.');
