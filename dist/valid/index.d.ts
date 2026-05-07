/**
 *
 * Valid index module
 *
 * Wraps ensure in a try/catch and returns a boolean type guard instead of throwing.
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare function isValid<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): obj is types.SchemaType<S>;
