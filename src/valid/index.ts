/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */

import * as types from '../types/index.js';
import {asserts} from '../asserts/index.js';

export function is_valid(
  obj: unknown,
  schema: types.Schema
): obj is types.SchemaType {
  try {
    asserts(obj, schema);
    return true;
  } catch (e) {
    return false;
  }
}
