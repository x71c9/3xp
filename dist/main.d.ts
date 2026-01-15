/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */
export { Schema, SchemaType, ValidationError, ValidationResult, } from './types/index';
import { set } from './config/index';
export declare const config: {
    set: typeof set;
};
export * from './ensure/index';
export * from './parse/index';
export * from './valid/index';
