/**
 *
 * Utils module
 *
 * @packageDocumentation
 *
 */
export function deep_clone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    return JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=index.js.map