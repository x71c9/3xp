/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index.js';
import {ensure} from '../ensure/index.js';

export function isValid<S extends types.Schema>(
  obj: unknown,
  schema: S,
  exact: boolean = true
): obj is types.SchemaType<S> {
  try {
    ensure(obj, schema, exact);
    return true;
  } catch (e) {
    return false;
  }
}
