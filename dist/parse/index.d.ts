/**
 *
 * Parse index module
 *
 * Validates an object against a schema, collects all errors without throwing, and returns a ValidationResult.
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare function parse<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): types.ValidationResult;
