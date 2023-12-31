/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */
export { Schema } from './types/index';
import { set } from './config/index';
export declare const config: {
    set: typeof set;
};
export * from './asserts/index';
export * from './valid/index';
