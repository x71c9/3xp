/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */

import ion from 'i0n';
import * as types from './types/index.js';
import * as utils from './utils/index.js';

const schema_primitive_types_single = {
  string: true,
  number: true,
  boolean: true,
} as const;

const schema_primitive_types = {
  ...schema_primitive_types_single,
  object: true,
} as const;

const root_attribute_reference = '[root]';

export function validate(
  obj: unknown,
  schema: types.Schema
): asserts obj is types.SchemaType {
  ion.trace(`Validating object:`, obj);
  ion.trace(`For schema:`, schema);
  _validate_schema(schema);
  const extended_schema = _extend_schema(schema);
  _validate_attribute(root_attribute_reference, obj, extended_schema);
  ion.debug(`The validation was succesfull`);
}

export function is_valid(
  obj: unknown,
  schema: types.Schema
): obj is types.SchemaType {
  try {
    validate(obj, schema);
    return true;
  } catch (e) {
    return false;
  }
}

function _validate_attribute(
  attribute_name: string,
  value: unknown,
  extended_schema: types.SchemaExtended
) {
  ion.trace(`Validating attribute '${attribute_name}'...`);
  // Validate optional false
  if (extended_schema.optional === false && typeof value === 'undefined') {
    throw new Error(`Missing required attribute '${attribute_name}'`);
  }
  // Validate optional true
  if (extended_schema.optional === true && typeof value === 'undefined') {
    return;
  }
  // Validate array true
  if (extended_schema.array === true) {
    if (!Array.isArray(value)) {
      throw new Error(
        `Attribute '${attribute_name}' must be an array.` +
          ` '${typeof value}' given.`
      );
    } else {
      for (let i = 0; i < value.length; i++) {
        const cloned_schema = utils.deep_clone(extended_schema);
        cloned_schema.array = false;
        _validate_attribute(`${attribute_name}[${i}]`, value[i], cloned_schema);
      }
      return;
    }
  }
  // Validate type
  if (extended_schema.type !== typeof value) {
    throw new Error(
      `Attribute '${attribute_name}' has an invalid type.` +
        ` Type should be '${extended_schema.type}'. Type given` +
        ` '${typeof value}'`
    );
  }
  // Validate options
  const options = extended_schema.options;
  if (options && !options.includes(value as any)) {
    throw new Error(
      `Invalid attribute '${attribute_name}'. The only possible` +
        ` values are [${extended_schema.options}].`
    );
  }
  // Validate required empty string
  if (
    extended_schema.type === 'string' &&
    extended_schema.optional === false &&
    value === ''
  ) {
    throw new Error(
      `Missing required attribute '${attribute_name}'.` +
        ` The string cannot be empty.`
    );
  }
  // Validate nested attribute
  if (extended_schema.schema) {
    const value_record = value as Record<string, unknown>;
    for (const [k, v] of Object.entries(extended_schema.schema)) {
      if (v.optional === false && !(k in value_record)) {
        throw new Error(`Missing required attribute '${k}'`);
      }
    }
    for (const [k, v] of Object.entries(value_record)) {
      if (!(k in extended_schema.schema)) {
        throw new Error(
          `No additional attributes are permitted.` +
            ` Attribute '${k}' in not in schema`
        );
      }
      _validate_attribute(k, v, extended_schema.schema[k]);
    }
  }
}

function _validate_schema(
  schema_definition: types.Schema
): asserts schema_definition is types.Schema {
  ion.trace(`Validating schema...`);
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
      ` [${Object.keys(schema_primitive_types_single)}]` +
      ` or in object format.`
  );
  _validate_schema_attribute_object(attribute_name, schema_definition);
  if ('schema' in schema_definition) {
    const attribute_schema = schema_definition.schema;
    for (const [key, value] of Object.entries(attribute_schema)) {
      _validate_schema_attribute(key, value);
    }
  }
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
  attribute: object
): asserts attribute is types.AttributeSchema {
  if (!('type' in attribute)) {
    throw new Error(
      `The schema property '${attribute_name}' is` +
        ` missing the required 'type' attribute`
    );
  }
  if (!_valid_primitive_type(attribute.type)) {
    throw new Error(
      `The schema property '${attribute_name}' has an` +
        ` invalid 'type' attribute value`
    );
  }
  if ('array' in attribute && !_valid_boolean(attribute.array)) {
    throw new Error(
      `The schema property '${attribute_name}' has an` +
        ` invalid 'array' attribute value`
    );
  }
  if ('optional' in attribute && !_valid_boolean(attribute.optional)) {
    throw new Error(
      `The schema property '${attribute_name}' has an` +
        ` invalid 'optional' attribute`
    );
  }
  if (attribute.type === 'object' && !('schema' in attribute)) {
    throw new Error(
      `The schema property '${attribute_name}' has a type 'object' but is` +
        ` missing the required attribute 'schema'`
    );
  }
}

function _extend_schema(schema: types.Schema): types.SchemaExtended {
  if (typeof schema === 'string') {
    const extended_schema: types.SchemaExtended = {
      type: schema,
      array: false,
      optional: false,
      options: null,
      schema: null,
    };
    return extended_schema;
  }
  const extended_schema: types.SchemaExtended = {
    type: schema.type,
    array: schema.array || false,
    optional: schema.optional || false,
    options: schema.options || null,
    schema: !schema.schema ? null : _extend_attribute_schema(schema.schema),
  };
  return extended_schema;
}

function _extend_attribute_schema(
  attribute_schema: types.AttributeSchema
): types.AttributeSchemaExtended {
  const attribute_schema_extended: types.AttributeSchemaExtended = {};
  for (const [key, value] of Object.entries(attribute_schema)) {
    const extended_schema = _extend_schema(value);
    attribute_schema_extended[key] = extended_schema;
  }
  return attribute_schema_extended;
}

function _valid_primitive_single_type(
  schema_attribute: unknown
): schema_attribute is types.PrimitiveType {
  if (!_valid_string(schema_attribute)) {
    return false;
  }
  if (!(schema_attribute in schema_primitive_types_single)) {
    return false;
  }
  return true;
}

function _valid_primitive_type(
  schema_attribute: unknown
): schema_attribute is types.Type {
  if (!_valid_string(schema_attribute)) {
    return false;
  }
  if (!(schema_attribute in schema_primitive_types)) {
    return false;
  }
  return true;
}
