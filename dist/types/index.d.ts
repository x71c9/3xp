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
export declare const PRIMITIVE: {
    ANY: string;
    ARRAY: string;
    BOOLEAN: string;
    ENUM: string;
    NULL: string;
    NUMBER: string;
    OBJECT: string;
    STRING: string;
    UNDEFINED: string;
    UNKNOWN: string;
};
export type Primitive = ObjectValue<typeof PRIMITIVE>;
type ObjectValue<T> = T[keyof T];
export {};
