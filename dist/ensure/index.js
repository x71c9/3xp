"use strict";
/**
 *
 * Ensure index module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = void 0;
const index_1 = require("../log/index");
const index_2 = require("../common/index");
function ensure(obj, schema, exact = true) {
    index_1.log.trace(`Validating object:`, obj);
    index_1.log.trace(`For schema:`, schema);
    index_1.log.trace(`Exact mode:`, exact);
    (0, index_2._validate_schema)(schema);
    const expanded_schema = (0, index_2._expand_schema)(schema);
    // Throw on first error
    const _handle_error = (_path, message) => {
        throw new Error(message);
    };
    (0, index_2._validate_attribute)(index_2.root_attribute_reference, obj, expanded_schema, exact, _handle_error);
    index_1.log.success(`The validation was succesfull`);
}
exports.ensure = ensure;
//# sourceMappingURL=index.js.map