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

// TODO: Implement SchemaType
export type SchemaType = any;

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
} as const;

export type Primitive = ObjectValue<typeof PRIMITIVE>;

type ObjectValue<T> = T[keyof T];
