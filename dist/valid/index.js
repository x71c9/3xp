"use strict";
/**
 *
 * Valid index module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const index_js_1 = require("../ensure/index.js");
function isValid(obj, schema, exact = true) {
    try {
        (0, index_js_1.ensure)(obj, schema, exact);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isValid = isValid;
//# sourceMappingURL=index.js.map