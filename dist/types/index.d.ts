/**
 *
 * Types index module
 *
 * @packageDocumentation
 *
 */
export type Schema = PrimitiveType | SchemaOpen;
export type AttributeSchema = {
    [k: string]: Schema;
};
export type SchemaOpen = {
    type: Type;
    array?: boolean;
    optional?: boolean;
    options?: Options;
    schema?: AttributeSchema;
};
export type AttributeSchemaExtended = {
    [k: string]: SchemaExtended;
};
export type SchemaExtended = {
    type: Type;
    array: boolean;
    optional: boolean;
    options: Options | null;
    schema: AttributeSchemaExtended | null;
};
export type PrimitiveType = 'string' | 'number' | 'boolean' | 'any';
export type SchemaType = any;
export type Config = {};
export type Type = PrimitiveType | 'object';
type Options = (string | number | boolean)[];
export {};
