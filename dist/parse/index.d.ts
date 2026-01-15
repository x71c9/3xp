/**
 *
 * Parse index module
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare function parse<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): types.ValidationResult;
