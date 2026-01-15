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
  _validate_attribute as _validate_attribute_shared,
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

  // Throw on first error
  const _handle_error = (_path: string, message: string) => {
    throw new Error(message);
  };

  _validate_attribute_shared(
    root_attribute_reference,
    obj,
    expanded_schema,
    exact,
    _handle_error
  );

  log.success(`The validation was succesfull`);
}
