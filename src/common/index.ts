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

export function _validate_attribute(
  attribute_name: string,
  value: unknown,
  expanded_schema: types.ExpandedSchema,
  exact: boolean,
  _handle_error: (path: string, message: string) => void
): void {
  log.trace(`Validating attribute '${attribute_name}'...`);

  // Validate optional false
  if (expanded_schema.primitive === 'any') {
    log.debug(`Attribute '${attribute_name}' is valid (any type).`);
    return;
  }

  if (expanded_schema.optional === false && typeof value === 'undefined') {
    _handle_error(
      attribute_name,
      `Missing required attribute '${attribute_name}'`
    );
    return;
  }

  // Validate optional true
  if (expanded_schema.optional === true && typeof value === 'undefined') {
    log.debug(
      `Attribute '${attribute_name}' is valid (optional and undefined).`
    );
    return;
  }

  // Validate array
  if (expanded_schema.primitive === 'array') {
    if (!Array.isArray(value)) {
      _handle_error(
        attribute_name,
        `Attribute '${attribute_name}' must be an array. '${typeof value}' given.`
      );
      return;
    }

    if (expanded_schema.item) {
      for (let i = 0; i < value.length; i++) {
        _validate_attribute(
          `${attribute_name}[${i}]`,
          value[i],
          expanded_schema.item as types.ExpandedSchema,
          exact,
          _handle_error
        );
      }
    }

    if (expanded_schema.values) {
      for (let i = 0; i < value.length; i++) {
        if (!expanded_schema.values.includes(value[i])) {
          _handle_error(
            `${attribute_name}[${i}]`,
            `Element of index ${i} of the array '${attribute_name}' is invalid. Possible values are [${expanded_schema.values}]`
          );
        }
      }
    }

    log.debug(`Attribute '${attribute_name}' validated with errors.`);
    return;
  }

  // Validate Date
  if (expanded_schema.primitive === 'date') {
    if (!(value instanceof Date)) {
      _handle_error(
        attribute_name,
        `Attribute '${attribute_name}' must be an instance of Date`
      );
      return;
    }
    // Check for invalid dates (e.g., new Date('invalid'))
    if (isNaN(value.getTime())) {
      _handle_error(
        attribute_name,
        `Attribute '${attribute_name}' must be a valid Date`
      );
    }
    log.debug(`Attribute '${attribute_name}' validated with errors.`);
    return;
  }

  // Validate type
  switch (expanded_schema.primitive) {
    case 'enum': {
      const possible_values: Set<string> = new Set();
      if (
        !expanded_schema.values ||
        !Array.isArray(expanded_schema.values) ||
        expanded_schema.values.length < 1
      ) {
        throw new Error(
          `Attribute ${attribute_name} has invalid possible values.` +
            ` It cannot be evaluated`
        );
      }
      for (const value of expanded_schema.values) {
        possible_values.add(typeof value);
      }
      if (!possible_values.has(typeof value)) {
        _handle_error(
          attribute_name,
          `Attribute '${attribute_name}' has an invalid type. Type should be one of the following ['${Array.from(
            possible_values
          )}]. Type given '${typeof value}'`
        );
      }
      break;
    }
    case 'unknown': {
      break;
    }
    default: {
      if (expanded_schema.primitive !== typeof value) {
        _handle_error(
          attribute_name,
          `Attribute '${attribute_name}' has an invalid type. Type should be '${
            expanded_schema.primitive
          }'. Type given '${typeof value}'`
        );
        // Early return for type mismatch on objects - can't validate properties
        if (expanded_schema.primitive === 'object') {
          return;
        }
      }
    }
  }

  // Validate options
  const options = expanded_schema.values;
  if (options && !options.includes(value as any)) {
    _handle_error(
      attribute_name,
      `Invalid attribute '${attribute_name}'. The only possible values are [${expanded_schema.values}].`
    );
  }

  // Validate required empty string
  if (
    expanded_schema.primitive === 'string' &&
    expanded_schema.optional === false &&
    value === ''
  ) {
    _handle_error(
      attribute_name,
      `Missing required attribute '${attribute_name}'. The string cannot be empty.`
    );
  }

  // Validate nested attribute
  if (expanded_schema.properties) {
    // Early return if value is not an object
    if (typeof value !== 'object' || value === null) {
      return;
    }

    const value_record = value as Record<string, unknown>;

    // Validate all required attributes - collect ALL missing ones
    for (const [k, v] of Object.entries(
      expanded_schema.properties as types.ExpandedProperties
    )) {
      if (
        v.primitive !== 'any' &&
        v.optional === false &&
        !(k in value_record)
      ) {
        _handle_error(k, `Missing required attribute '${k}'`);
      }
    }

    // Validate each present property
    for (const [k, v] of Object.entries(value_record)) {
      // Validate not additional attribute
      if (!(k in expanded_schema.properties)) {
        if (exact) {
          _handle_error(
            k,
            `No additional attributes are permitted. Attribute '${k}' in not in schema`
          );
        } else {
          log.debug(
            `Skipping additional attribute '${k}' (exact mode is disabled)`
          );
        }
        continue;
      }

      _validate_attribute(
        k,
        v,
        expanded_schema.properties[k] as types.ExpandedSchema,
        exact,
        _handle_error
      );
    }
  }

  log.debug(`Attribute '${attribute_name}' validated with errors.`);
}
