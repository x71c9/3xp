/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */

export {Schema} from './types/index.js';

import {set} from './config/index.js';
export const config = {set};

export * from './asserts/index.js';
export * from './valid/index.js';
