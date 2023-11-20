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
export declare const PRIMITIVE: {
    ARRAY: string;
    ENUM: string;
    BOOLEAN: string;
    NUMBER: string;
    STRING: string;
    OBJECT: string;
    ANY: string;
    UNKNOWN: string;
    NULL: string;
    UNDEFINED: string;
    UNRESOLVED: string;
};
export type Primitive = ObjectValue<typeof PRIMITIVE>;
type ObjectValue<T> = T[keyof T];
export {};
