"use strict";
/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_valid = void 0;
const index_js_1 = require("../asserts/index.js");
function is_valid(obj, schema) {
    try {
        (0, index_js_1.asserts)(obj, schema);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.is_valid = is_valid;
//# sourceMappingURL=index.js.map