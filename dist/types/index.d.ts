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
    readonly ANY: "any";
    readonly ARRAY: "array";
    readonly BOOLEAN: "boolean";
    readonly ENUM: "enum";
    readonly NULL: "null";
    readonly NUMBER: "number";
    readonly OBJECT: "object";
    readonly STRING: "string";
    readonly UNDEFINED: "undefined";
    readonly UNKNOWN: "unknown";
};
export type Primitive = ObjectValue<typeof PRIMITIVE>;
type ObjectValue<T> = T[keyof T];
export {};
