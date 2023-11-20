/**
 *
 * Types index module
 *
 * @packageDocumentation
 *
 */

export type Config = {
  debug: boolean;
};

export type Schema = Primitive | ExpandedSchema;

// TODO: Implement SchemaType
export type SchemaType = any;

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
  ARRAY: 'array',
  ENUM: 'enum',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  STRING: 'string',
  OBJECT: 'object',
  ANY: 'any',
  UNKNOWN: 'unknown',
  NULL: 'null',
  UNDEFINED: 'undefined',
  UNRESOLVED: 'unresolved',
};

export type Primitive = ObjectValue<typeof PRIMITIVE>;

type ObjectValue<T> = T[keyof T];

// export type AttributeSchema = {
//   [k: string]: Schema;
// };

// export type SchemaOpen = {
//   type: Type;
//   array?: boolean;
//   optional?: boolean;
//   options?: Options;
//   schema?: AttributeSchema;
// };

// export type AttributeSchemaExtended = {
//   [k: string]: SchemaExtended;
// };

// export type SchemaExtended = {
//   type: Type;
//   array: boolean;
//   optional: boolean;
//   options: Options | null;
//   schema: AttributeSchemaExtended | null;
// };

// export type Type = Primitive | 'object';

// type Options = (string | number | boolean)[];
