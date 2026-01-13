/**
 *
 * Ensure index module
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare function ensure<S extends types.Schema>(obj: unknown, schema: S, exact?: boolean): asserts obj is types.SchemaType<S>;
