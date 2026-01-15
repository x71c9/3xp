/**
 *
 * Common validation functions shared between ensure and parse
 *
 * @packageDocumentation
 *
 */
import * as types from '../types/index';
export declare const root_attribute_reference = "[root]";
export declare function _validate_schema(schema_definition: types.Schema): asserts schema_definition is types.Schema;
export declare function _expand_schema(schema: types.Schema): types.ExpandedSchema;
