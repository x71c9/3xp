/**
 *
 * Ensure index module
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index';
import {log} from '../log/index';
import {
  root_attribute_reference,
  _validate_schema,
  _expand_schema,
} from '../common/index';

export function ensure<S extends types.Schema>(
  obj: unknown,
  schema: S,
  exact: boolean = true
): asserts obj is types.SchemaType<S> {
  log.trace(`Validating object:`, obj);
  log.trace(`For schema:`, schema);
  log.trace(`Exact mode:`, exact);
  _validate_schema(schema);
  const expanded_schema = _expand_schema(schema);
  _validate_attribute(root_attribute_reference, obj, expanded_schema, exact);
  log.success(`The validation was succesfull`);
}

function _validate_attribute(
  attribute_name: string,
  value: unknown,
  expanded_schema: types.ExpandedSchema,
  exact: boolean = true
) {
  log.trace(`Validating attribute '${attribute_name}'...`);
  // Validate optional false
  if (expanded_schema.primitive === 'any') {
    log.debug(`Attribute '${attribute_name}' is valid.`);
    return;
  }
  if (expanded_schema.optional === false && typeof value === 'undefined') {
    throw new Error(`Missing required attribute '${attribute_name}'`);
  }
  // Validate optional true
  if (expanded_schema.optional === true && typeof value === 'undefined') {
    log.debug(`Attribute '${attribute_name}' is valid.`);
    return;
  }
  // Validate array true
  if (expanded_schema.primitive === 'array') {
    if (!Array.isArray(value)) {
      throw new Error(
        `Attribute '${attribute_name}' must be an array.` +
          ` '${typeof value}' given.`
      );
    }
    if (expanded_schema.item) {
      for (let i = 0; i < value.length; i++) {
        _validate_attribute(
          `${attribute_name}[${i}]`,
          value[i],
          expanded_schema.item as types.ExpandedSchema,
          exact
        );
      }
    }
    if (expanded_schema.values) {
      for (let i = 0; i < value.length; i++) {
        if (!expanded_schema.values.includes(value[i])) {
          throw new Error(
            `Element of index ${i} of the array '${attribute_name}' is invalid.` +
              ` Possible values are [${expanded_schema.values}]`
          );
        }
      }
    }
    log.debug(`Attribute '${attribute_name}' is valid.`);
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
        throw new Error(
          `Attribute '${attribute_name}' has an invalid type.` +
            ` Type should be one of the following ['${Array.from(
              possible_values
            )}'].` +
            ` Type given '${typeof value}'`
        );
      }
      break;
    }
    case 'unknown': {
      break;
    }
    default: {
      if (expanded_schema.primitive !== typeof value) {
        throw new Error(
          `Attribute '${attribute_name}' has an invalid type.` +
            ` Type should be '${expanded_schema.primitive}'. Type given` +
            ` '${typeof value}'`
        );
      }
    }
  }
  // Validate options
  const options = expanded_schema.values;
  if (options && !options.includes(value as any)) {
    throw new Error(
      `Invalid attribute '${attribute_name}'. The only possible` +
        ` values are [${expanded_schema.values}].`
    );
  }
  // Validate required empty string
  if (
    expanded_schema.primitive === 'string' &&
    expanded_schema.optional === false &&
    value === ''
  ) {
    throw new Error(
      `Missing required attribute '${attribute_name}'.` +
        ` The string cannot be empty.`
    );
  }
  // Validate nested attribute
  if (expanded_schema.properties) {
    const value_record = value as Record<string, unknown>;
    // Validate all required attributes
    for (const [k, v] of Object.entries(
      expanded_schema.properties as types.ExpandedProperties
    )) {
      if (
        v.primitive !== 'any' &&
        v.optional === false &&
        !(k in value_record)
      ) {
        throw new Error(`Missing required attribute '${k}'`);
      }
    }
    for (const [k, v] of Object.entries(value_record)) {
      // Validate not additional attribute
      if (!(k in expanded_schema.properties)) {
        if (exact) {
          throw new Error(
            `No additional attributes are permitted.` +
              ` Attribute '${k}' in not in schema`
          );
        } else {
          log.debug(
            `Skipping additional attribute '${k}' (exact mode is disabled)`
          );
          continue;
        }
      }
      _validate_attribute(
        k,
        v,
        expanded_schema.properties[k] as types.ExpandedSchema,
        exact
      );
    }
  }
  log.debug(`Attribute '${attribute_name}' is valid.`);
}
