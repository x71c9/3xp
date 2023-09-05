/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */
import * as types from './types/index.js';
export declare function validate(obj: unknown, schema: types.Schema): asserts obj is types.SchemaType;
export declare function is_valid(obj: unknown, schema: types.Schema): obj is types.SchemaType;
