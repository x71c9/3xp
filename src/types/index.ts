/**
 *
 * Types index module
 *
 * @packageDocumentation
 *
 */

import ion from 'i0n';

export type Config = {
  debug: boolean;
  spinner: ion.Spinner;
};

export type Schema = Primitive | ExpandedSchema;

export type SchemaType<S extends Schema> = S extends Primitive
  ? _PrimitiveToType<S>
  : S extends ExpandedSchema
  ? _ExpandedSchemaToType<S>
  : never;

type _PrimitiveToType<P extends Primitive> = P extends 'string'
  ? string
  : P extends 'number'
  ? number
  : P extends 'boolean'
  ? boolean
  : P extends 'date'
  ? Date
  : P extends 'null'
  ? null
  : P extends 'undefined'
  ? undefined
  : P extends 'any'
  ? any
  : P extends 'unknown'
  ? unknown
  : P extends 'array'
  ? any[]
  : P extends 'object'
  ? Record<string, any>
  : P extends 'enum'
  ? string | number
  : never;

type _ExpandedSchemaToType<S extends ExpandedSchema> = S extends {
  optional: true;
}
  ? _ExpandedSchemaToTypeRequired<S> | undefined
  : _ExpandedSchemaToTypeRequired<S>;

type _ExpandedSchemaToTypeRequired<S extends ExpandedSchema> = S extends {
  primitive: 'object';
  properties: infer P;
}
  ? P extends Properties
    ? _PropertiesToType<P>
    : Record<string, any>
  : S extends {primitive: 'array'; item: infer I}
  ? I extends Schema
    ? Array<SchemaType<I>>
    : any[]
  : S extends {primitive: infer Prim; values: infer V}
  ? V extends ReadonlyArray<infer Item>
    ? Item
    : Prim extends Primitive
    ? _PrimitiveToType<Prim>
    : never
  : S extends {primitive: infer Prim}
  ? Prim extends Primitive
    ? _PrimitiveToType<Prim>
    : never
  : never;

type _PropertiesToType<P extends Properties> = {
  [K in keyof P as P[K] extends {optional: true}
    ? never
    : P[K] extends ExpandedSchema
    ? P[K]['optional'] extends true
      ? never
      : K
    : K]: SchemaType<P[K]>;
} & {
  [K in keyof P as P[K] extends {optional: true}
    ? K
    : P[K] extends ExpandedSchema
    ? P[K]['optional'] extends true
      ? K
      : never
    : never]?: SchemaType<P[K]>;
};

export type ExpandedSchema = {
  item?: Schema;
  optional?: boolean;
  primitive: Primitive;
  properties?: Properties;
  values?: Values;
};

export type Properties = {
  [k: string]: Schema;
};

export type ExpandedProperties = {
  [k: string]: ExpandedSchema;
};

export type Values = readonly (string | number)[] | (string | number)[];

export type ValidationError = {
  path: string;
  message: string;
};

export type ValidationResult =
  | {success: true; errors: []}
  | {success: false; errors: ValidationError[]};

export const PRIMITIVE = {
  ANY: 'any',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ENUM: 'enum',
  NULL: 'null',
  NUMBER: 'number',
  OBJECT: 'object',
  STRING: 'string',
  UNDEFINED: 'undefined',
  UNKNOWN: 'unknown',
} as const;

export type Primitive = ObjectValue<typeof PRIMITIVE>;

type ObjectValue<T> = T[keyof T];
