/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */

export {
  Schema,
  SchemaType,
  ValidationError,
  ValidationResult,
} from './types/index';

import {set} from './config/index';
export const config = {set};

export * from './ensure/index';
export * from './parse/index';
export * from './valid/index';
