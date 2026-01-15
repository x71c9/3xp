"use strict";
/**
 *
 * Parse index module
 *
 * @packageDocumentation
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const index_1 = require("../log/index");
const index_2 = require("../common/index");
function parse(obj, schema, exact = true) {
    index_1.log.trace(`Parsing object:`, obj);
    index_1.log.trace(`For schema:`, schema);
    index_1.log.trace(`Exact mode:`, exact);
    (0, index_2._validate_schema)(schema);
    const expanded_schema = (0, index_2._expand_schema)(schema);
    // Collect all errors
    const errors = [];
    const _handle_error = (path, message) => {
        errors.push({ path, message });
    };
    (0, index_2._validate_attribute)(index_2.root_attribute_reference, obj, expanded_schema, exact, _handle_error);
    if (errors.length === 0) {
        index_1.log.success(`Parsing succeeded with no errors`);
        return {
            success: true,
            errors: [],
        };
    }
    else {
        index_1.log.debug(`Parsing failed with ${errors.length} error(s)`);
        return {
            success: false,
            errors: errors,
        };
    }
}
exports.parse = parse;
//# sourceMappingURL=index.js.map