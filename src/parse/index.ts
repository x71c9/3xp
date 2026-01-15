/**
 *
 * Parse index module
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

export function parse<S extends types.Schema>(
  obj: unknown,
  schema: S,
  exact: boolean = true
): types.ValidationResult {
  log.trace(`Parsing object:`, obj);
  log.trace(`For schema:`, schema);
  log.trace(`Exact mode:`, exact);
  _validate_schema(schema);
  const expanded_schema = _expand_schema(schema);
  const errors = _collect_validation_errors(
    root_attribute_reference,
    obj,
    expanded_schema,
    exact
  );
  if (errors.length === 0) {
    log.success(`Parsing succeeded with no errors`);
    return {
      success: true,
      errors: [],
    };
  } else {
    log.debug(`Parsing failed with ${errors.length} error(s)`);
    return {
      success: false,
      errors: errors,
    };
  }
}

function _collect_validation_errors(
  attribute_name: string,
  value: unknown,
  expanded_schema: types.ExpandedSchema,
  exact: boolean = true
): types.ValidationError[] {
  const errors: types.ValidationError[] = [];

  log.trace(`Collecting errors for attribute '${attribute_name}'...`);

  // Validate optional false
  if (expanded_schema.primitive === 'any') {
    log.debug(`Attribute '${attribute_name}' is valid (any type).`);
    return errors;
  }

  if (expanded_schema.optional === false && typeof value === 'undefined') {
    errors.push({
      path: attribute_name,
      message: `Missing required attribute '${attribute_name}'`,
    });
    return errors;
  }

  // Validate optional true
  if (expanded_schema.optional === true && typeof value === 'undefined') {
    log.debug(
      `Attribute '${attribute_name}' is valid (optional and undefined).`
    );
    return errors;
  }

  // Validate array
  if (expanded_schema.primitive === 'array') {
    if (!Array.isArray(value)) {
      errors.push({
        path: attribute_name,
        message: `Attribute '${attribute_name}' must be an array. '${typeof value}' given.`,
      });
      return errors;
    }

    if (expanded_schema.item) {
      for (let i = 0; i < value.length; i++) {
        const item_errors = _collect_validation_errors(
          `${attribute_name}[${i}]`,
          value[i],
          expanded_schema.item as types.ExpandedSchema,
          exact
        );
        errors.push(...item_errors);
      }
    }

    if (expanded_schema.values) {
      for (let i = 0; i < value.length; i++) {
        if (!expanded_schema.values.includes(value[i])) {
          errors.push({
            path: `${attribute_name}[${i}]`,
            message: `Element of index ${i} of the array '${attribute_name}' is invalid. Possible values are [${expanded_schema.values}]`,
          });
        }
      }
    }

    log.debug(
      `Attribute '${attribute_name}' validated with ${errors.length} error(s).`
    );
    return errors;
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
        errors.push({
          path: attribute_name,
          message: `Attribute '${attribute_name}' has an invalid type. Type should be one of the following ['${Array.from(
            possible_values
          )}]. Type given '${typeof value}'`,
        });
      }
      break;
    }
    case 'unknown': {
      break;
    }
    default: {
      if (expanded_schema.primitive !== typeof value) {
        errors.push({
          path: attribute_name,
          message: `Attribute '${attribute_name}' has an invalid type. Type should be '${
            expanded_schema.primitive
          }'. Type given '${typeof value}'`,
        });
        // Early return for type mismatch on objects - can't validate properties
        if (expanded_schema.primitive === 'object') {
          return errors;
        }
      }
    }
  }

  // Validate options
  const options = expanded_schema.values;
  if (options && !options.includes(value as any)) {
    errors.push({
      path: attribute_name,
      message: `Invalid attribute '${attribute_name}'. The only possible values are [${expanded_schema.values}].`,
    });
  }

  // Validate required empty string
  if (
    expanded_schema.primitive === 'string' &&
    expanded_schema.optional === false &&
    value === ''
  ) {
    errors.push({
      path: attribute_name,
      message: `Missing required attribute '${attribute_name}'. The string cannot be empty.`,
    });
  }

  // Validate nested attribute
  if (expanded_schema.properties) {
    // Early return if value is not an object
    if (typeof value !== 'object' || value === null) {
      return errors;
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
        errors.push({
          path: k,
          message: `Missing required attribute '${k}'`,
        });
      }
    }

    // Validate each present property
    for (const [k, v] of Object.entries(value_record)) {
      // Validate not additional attribute
      if (!(k in expanded_schema.properties)) {
        if (exact) {
          errors.push({
            path: k,
            message: `No additional attributes are permitted. Attribute '${k}' in not in schema`,
          });
        } else {
          log.debug(
            `Skipping additional attribute '${k}' (exact mode is disabled)`
          );
        }
        continue;
      }

      const nested_errors = _collect_validation_errors(
        k,
        v,
        expanded_schema.properties[k] as types.ExpandedSchema,
        exact
      );
      errors.push(...nested_errors);
    }
  }

  log.debug(
    `Attribute '${attribute_name}' validated with ${errors.length} error(s).`
  );
  return errors;
}
