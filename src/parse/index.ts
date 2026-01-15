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
  _validate_attribute,
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

  // Collect all errors
  const errors: types.ValidationError[] = [];
  const _handle_error = (path: string, message: string) => {
    errors.push({path, message});
  };

  _validate_attribute(
    root_attribute_reference,
    obj,
    expanded_schema,
    exact,
    _handle_error
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
