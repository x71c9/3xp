/**
 *
 * Ensure index module
 *
 * Validates an object against a schema and throws on the first error, acting as a type assertion.
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare function ensure<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): asserts obj is types.SchemaType<S>;
