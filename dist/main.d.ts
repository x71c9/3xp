/**
 *
 * Main module
 *
 * @packageDocumentation
 *
 */
export { Schema } from './types/index.js';
export declare const config: {
    set: (params: import("w3i").DeepPartial<import("./types/index.js").Config>) => void;
};
export * from './asserts/index.js';
export * from './valid/index.js';
