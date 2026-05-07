"use strict";
/**
 *
 * Valid index module
 *
 * Wraps ensure in a try/catch and returns a boolean type guard instead of throwing.
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = isValid;
const index_1 = require("../config/index");
const index_2 = require("../ensure/index");
const index_3 = require("../parse/index");
function isValid(obj, schema, exact = true) {
    try {
        (0, index_2.ensure)(obj, schema, exact);
        return true;
    }
    catch (e) {
        if (index_1.weights.params.print_errors === true) {
            const parsed = (0, index_3.parse)(obj, schema, exact);
            console.error(parsed.errors);
        }
        return false;
    }
}
//# sourceMappingURL=index.js.map