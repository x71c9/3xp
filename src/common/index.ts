/**
 *
 * Common validation functions shared between ensure and parse
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index';
import {log} from '../log/index';

export const root_attribute_reference = '[root]';

export function _validate_schema(
  schema_definition: types.Schema
): asserts schema_definition is types.Schema {
  log.trace(`Validating schema...`);
  _validate_schema_attribute(root_attribute_reference, schema_definition);
}

function _validate_schema_attribute(
  attribute_name: string,
  schema_definition: unknown
): asserts schema_definition is types.Schema {
  if (_valid_primitive_single_type(schema_definition)) {
    return;
  }
  _assert_valid_object(
    schema_definition,
    `The attribute '${attribute_name}' is invalid.` +
      ` It should be either one of the primitive types:` +
      ` [${Object.values(types.PRIMITIVE)}]` +
      ` or in object format.`
  );
  _validate_schema_attribute_object(attribute_name, schema_definition);
  if ('properties' in schema_definition) {
    const attribute_properties = schema_definition.properties;
    if (typeof attribute_properties !== 'object') {
      return;
    }
    for (const [key, value] of Object.entries(attribute_properties)) {
      _validate_schema_attribute(key, value);
    }
  }
}

export function _expand_schema(schema: types.Schema): types.ExpandedSchema {
  if (typeof schema === 'string') {
    const expanded_schema: types.ExpandedSchema = {
      primitive: schema,
      optional: false,
    };
    return expanded_schema;
  }
  const expanded_schema: types.ExpandedSchema = {
    primitive: schema.primitive,
    optional: schema.optional || false,
    values: schema.values,
    item: !schema.item ? undefined : _expand_schema(schema.item),
    properties: !schema.properties
      ? undefined
      : _expand_attribute_schema(schema.properties),
  };
  return expanded_schema;
}

function _expand_attribute_schema(
  attribute_schema: types.Properties
): types.ExpandedProperties {
  const expanded_properties: types.ExpandedProperties = {};
  for (const [key, value] of Object.entries(attribute_schema)) {
    const expanded_property = _expand_schema(value);
    expanded_properties[key] = expanded_property;
  }
  return expanded_properties;
}

function _valid_object(o: unknown): o is Record<string, any> {
  return !!o && typeof o === 'object';
}

function _valid_string(s: unknown): s is string {
  return typeof s === 'string' && s !== '';
}

function _valid_boolean(b: unknown): b is boolean {
  return typeof b === 'boolean';
}

function _assert_valid_object(
  obj: unknown,
  message: string
): asserts obj is Record<string, any> {
  if (!_valid_object(obj)) {
    throw new Error(message);
  }
}

function _validate_schema_attribute_object(
  attribute_name: string,
  attribute: object | string
): asserts attribute is types.Schema {
  if (typeof attribute === 'string') {
    throw new Error(`There was a problem processing the attribute`);
  }
  if (!('primitive' in attribute)) {
    throw new Error(
      `The schema property '${attribute_name}' is` +
        ` missing the required 'primitive' attribute`
    );
  }
  if (!_valid_primitive_type(attribute.primitive)) {
    throw new Error(
      `The schema property '${attribute_name}' has an` +
        ` invalid 'primitive' attribute value`
    );
  }
  if ('optional' in attribute && !_valid_boolean(attribute.optional)) {
    throw new Error(
      `The schema property '${attribute_name}' has an` +
        ` invalid 'optional' attribute`
    );
  }
}

function _valid_primitive_single_type(
  schema_attribute: unknown
): schema_attribute is types.Primitive {
  if (!_valid_string(schema_attribute)) {
    return false;
  }
  if (!Object.values(types.PRIMITIVE).includes(schema_attribute as any)) {
    return false;
  }
  return true;
}

function _valid_primitive_type(
  schema_attribute: unknown
): schema_attribute is types.Primitive {
  if (!_valid_string(schema_attribute)) {
    return false;
  }
  if (!Object.values(types.PRIMITIVE).includes(schema_attribute as any)) {
    return false;
  }
  return true;
}
