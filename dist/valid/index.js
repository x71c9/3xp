"use strict";
/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_valid = is_valid;
const index_js_1 = require("../asserts/index.js");
function is_valid(obj, schema, exact = true) {
    try {
        (0, index_js_1.asserts)(obj, schema, exact);
        return true;
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=index.js.map