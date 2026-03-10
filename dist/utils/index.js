"use strict";
/**
 *
 * Utils module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deep_clone = deep_clone;
function deep_clone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    return JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=index.js.map