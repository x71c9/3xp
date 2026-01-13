/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */

export {Schema, SchemaType} from './types/index';

import {set} from './config/index';
export const config = {set};

export * from './ensure/index';
export * from './valid/index';
