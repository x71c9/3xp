/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index.js';
import {asserts} from '../asserts/index.js';

export function is_valid<S extends types.Schema>(
  obj: unknown,
  schema: S,
  exact: boolean = true
): obj is types.SchemaType<S> {
  try {
    asserts(obj, schema, exact);
    return true;
  } catch (e) {
    return false;
  }
}
