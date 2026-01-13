/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index.js';
export declare function isValid<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): obj is types.SchemaType<S>;
