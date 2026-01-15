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
    const errors = _collect_validation_errors(index_2.root_attribute_reference, obj, expanded_schema, exact);
    if (errors.length === 0) {
        index_1.log.success(`Parsing succeeded with no errors`);
        return {
            success: true,
            errors: []
        };
    }
    else {
        index_1.log.debug(`Parsing failed with ${errors.length} error(s)`);
        return {
            success: false,
            errors: errors
        };
    }
}
exports.parse = parse;
function _collect_validation_errors(attribute_name, value, expanded_schema, exact = true) {
    const errors = [];
    index_1.log.trace(`Collecting errors for attribute '${attribute_name}'...`);
    // Validate optional false
    if (expanded_schema.primitive === 'any') {
        index_1.log.debug(`Attribute '${attribute_name}' is valid (any type).`);
        return errors;
    }
    if (expanded_schema.optional === false && typeof value === 'undefined') {
        errors.push({
            path: attribute_name,
            message: `Missing required attribute '${attribute_name}'`
        });
        return errors;
    }
    // Validate optional true
    if (expanded_schema.optional === true && typeof value === 'undefined') {
        index_1.log.debug(`Attribute '${attribute_name}' is valid (optional and undefined).`);
        return errors;
    }
    // Validate array
    if (expanded_schema.primitive === 'array') {
        if (!Array.isArray(value)) {
            errors.push({
                path: attribute_name,
                message: `Attribute '${attribute_name}' must be an array. '${typeof value}' given.`
            });
            return errors;
        }
        if (expanded_schema.item) {
            for (let i = 0; i < value.length; i++) {
                const item_errors = _collect_validation_errors(`${attribute_name}[${i}]`, value[i], expanded_schema.item, exact);
                errors.push(...item_errors);
            }
        }
        if (expanded_schema.values) {
            for (let i = 0; i < value.length; i++) {
                if (!expanded_schema.values.includes(value[i])) {
                    errors.push({
                        path: `${attribute_name}[${i}]`,
                        message: `Element of index ${i} of the array '${attribute_name}' is invalid. Possible values are [${expanded_schema.values}]`
                    });
                }
            }
        }
        index_1.log.debug(`Attribute '${attribute_name}' validated with ${errors.length} error(s).`);
        return errors;
    }
    // Validate type
    switch (expanded_schema.primitive) {
        case 'enum': {
            const possible_values = new Set();
            if (!expanded_schema.values ||
                !Array.isArray(expanded_schema.values) ||
                expanded_schema.values.length < 1) {
                throw new Error(`Attribute ${attribute_name} has invalid possible values.` +
                    ` It cannot be evaluated`);
            }
            for (const value of expanded_schema.values) {
                possible_values.add(typeof value);
            }
            if (!possible_values.has(typeof value)) {
                errors.push({
                    path: attribute_name,
                    message: `Attribute '${attribute_name}' has an invalid type. Type should be one of the following ['${Array.from(possible_values)}]. Type given '${typeof value}'`
                });
            }
            break;
        }
        case 'unknown': {
            break;
        }
        default: {
            if (expanded_schema.primitive !== typeof value) {
                errors.push({
                    path: attribute_name,
                    message: `Attribute '${attribute_name}' has an invalid type. Type should be '${expanded_schema.primitive}'. Type given '${typeof value}'`
                });
                // Early return for type mismatch on objects - can't validate properties
                if (expanded_schema.primitive === 'object') {
                    return errors;
                }
            }
        }
    }
    // Validate options
    const options = expanded_schema.values;
    if (options && !options.includes(value)) {
        errors.push({
            path: attribute_name,
            message: `Invalid attribute '${attribute_name}'. The only possible values are [${expanded_schema.values}].`
        });
    }
    // Validate required empty string
    if (expanded_schema.primitive === 'string' &&
        expanded_schema.optional === false &&
        value === '') {
        errors.push({
            path: attribute_name,
            message: `Missing required attribute '${attribute_name}'. The string cannot be empty.`
        });
    }
    // Validate nested attribute
    if (expanded_schema.properties) {
        // Early return if value is not an object
        if (typeof value !== 'object' || value === null) {
            return errors;
        }
        const value_record = value;
        // Validate all required attributes - collect ALL missing ones
        for (const [k, v] of Object.entries(expanded_schema.properties)) {
            if (v.primitive !== 'any' &&
                v.optional === false &&
                !(k in value_record)) {
                errors.push({
                    path: k,
                    message: `Missing required attribute '${k}'`
                });
            }
        }
        // Validate each present property
        for (const [k, v] of Object.entries(value_record)) {
            // Validate not additional attribute
            if (!(k in expanded_schema.properties)) {
                if (exact) {
                    errors.push({
                        path: k,
                        message: `No additional attributes are permitted. Attribute '${k}' in not in schema`
                    });
                }
                else {
                    index_1.log.debug(`Skipping additional attribute '${k}' (exact mode is disabled)`);
                }
                continue;
            }
            const nested_errors = _collect_validation_errors(k, v, expanded_schema.properties[k], exact);
            errors.push(...nested_errors);
        }
    }
    index_1.log.debug(`Attribute '${attribute_name}' validated with ${errors.length} error(s).`);
    return errors;
}
//# sourceMappingURL=index.js.map