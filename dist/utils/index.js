"use strict";
/**
 *
 * Utils module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deep_clone = void 0;
function deep_clone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    return JSON.parse(JSON.stringify(obj));
}
exports.deep_clone = deep_clone;
//# sourceMappingURL=index.js.map