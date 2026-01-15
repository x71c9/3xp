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
    _validate_attribute(index_2.root_attribute_reference, obj, expanded_schema, exact);
    index_1.log.success(`The validation was succesfull`);
}
exports.ensure = ensure;
function _validate_attribute(attribute_name, value, expanded_schema, exact = true) {
    index_1.log.trace(`Validating attribute '${attribute_name}'...`);
    // Validate optional false
    if (expanded_schema.primitive === 'any') {
        index_1.log.debug(`Attribute '${attribute_name}' is valid.`);
        return;
    }
    if (expanded_schema.optional === false && typeof value === 'undefined') {
        throw new Error(`Missing required attribute '${attribute_name}'`);
    }
    // Validate optional true
    if (expanded_schema.optional === true && typeof value === 'undefined') {
        index_1.log.debug(`Attribute '${attribute_name}' is valid.`);
        return;
    }
    // Validate array true
    if (expanded_schema.primitive === 'array') {
        if (!Array.isArray(value)) {
            throw new Error(`Attribute '${attribute_name}' must be an array.` +
                ` '${typeof value}' given.`);
        }
        if (expanded_schema.item) {
            for (let i = 0; i < value.length; i++) {
                _validate_attribute(`${attribute_name}[${i}]`, value[i], expanded_schema.item, exact);
            }
        }
        if (expanded_schema.values) {
            for (let i = 0; i < value.length; i++) {
                if (!expanded_schema.values.includes(value[i])) {
                    throw new Error(`Element of index ${i} of the array '${attribute_name}' is invalid.` +
                        ` Possible values are [${expanded_schema.values}]`);
                }
            }
        }
        index_1.log.debug(`Attribute '${attribute_name}' is valid.`);
        return;
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
                throw new Error(`Attribute '${attribute_name}' has an invalid type.` +
                    ` Type should be one of the following ['${Array.from(possible_values)}'].` +
                    ` Type given '${typeof value}'`);
            }
            break;
        }
        case 'unknown': {
            break;
        }
        default: {
            if (expanded_schema.primitive !== typeof value) {
                throw new Error(`Attribute '${attribute_name}' has an invalid type.` +
                    ` Type should be '${expanded_schema.primitive}'. Type given` +
                    ` '${typeof value}'`);
            }
        }
    }
    // Validate options
    const options = expanded_schema.values;
    if (options && !options.includes(value)) {
        throw new Error(`Invalid attribute '${attribute_name}'. The only possible` +
            ` values are [${expanded_schema.values}].`);
    }
    // Validate required empty string
    if (expanded_schema.primitive === 'string' &&
        expanded_schema.optional === false &&
        value === '') {
        throw new Error(`Missing required attribute '${attribute_name}'.` +
            ` The string cannot be empty.`);
    }
    // Validate nested attribute
    if (expanded_schema.properties) {
        const value_record = value;
        // Validate all required attributes
        for (const [k, v] of Object.entries(expanded_schema.properties)) {
            if (v.primitive !== 'any' &&
                v.optional === false &&
                !(k in value_record)) {
                throw new Error(`Missing required attribute '${k}'`);
            }
        }
        for (const [k, v] of Object.entries(value_record)) {
            // Validate not additional attribute
            if (!(k in expanded_schema.properties)) {
                if (exact) {
                    throw new Error(`No additional attributes are permitted.` +
                        ` Attribute '${k}' in not in schema`);
                }
                else {
                    index_1.log.debug(`Skipping additional attribute '${k}' (exact mode is disabled)`);
                    continue;
                }
            }
            _validate_attribute(k, v, expanded_schema.properties[k], exact);
        }
    }
    index_1.log.debug(`Attribute '${attribute_name}' is valid.`);
}
//# sourceMappingURL=index.js.map