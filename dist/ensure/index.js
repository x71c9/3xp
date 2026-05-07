"use strict";
/**
 *
 * Ensure index module
 *
 * Validates an object against a schema and throws on the first error, acting as a type assertion.
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = ensure;
const index_1 = require("../config/index");
const index_2 = require("../parse/index");
const index_3 = require("../log/index");
const index_4 = require("../common/index");
function ensure(obj, schema, exact = true) {
    index_3.log.trace(`Validating object:`, obj);
    index_3.log.trace(`For schema:`, schema);
    index_3.log.trace(`Exact mode:`, exact);
    (0, index_4._validate_schema)(schema);
    const expanded_schema = (0, index_4._expand_schema)(schema);
    // Throw on first error
    const _handle_error = (_path, message) => {
        if (index_1.weights.params.print_errors === true) {
            const parsed = (0, index_2.parse)(obj, schema, exact);
            console.error(parsed.errors);
        }
        throw new Error(message);
    };
    (0, index_4._validate_attribute)(index_4.root_attribute_reference, obj, expanded_schema, exact, _handle_error);
    index_3.log.success(`The validation was succesfull`);
}
//# sourceMappingURL=index.js.map