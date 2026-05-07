/**
 *
 * Valid index module
 *
 * Wraps ensure in a try/catch and returns a boolean type guard instead of throwing.
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index';
import {weights} from '../config/index';
import {ensure} from '../ensure/index';
import {parse} from '../parse/index';

export function isValid<S extends types.Schema>(
  obj: unknown,
  schema: S,
  exact: boolean = true,
): obj is types.SchemaType<S> {
  try {
    ensure(obj, schema, exact);
    return true;
  } catch (e) {
    if (weights.params.print_errors === true) {
      const parsed = parse(obj, schema, exact);
      console.error(parsed.errors);
    }
    return false;
  }
}
