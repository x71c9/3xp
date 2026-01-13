"use strict";
/**
 *
 * Run module
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
index_js_1.default.config.set({ debug: true });
const obj = {
    hello: 'world',
    boo: 'an-option',
    foo: true,
    moo: {
        aaa: 'a',
        bbb: ['a', 'b', 'a'],
        ccc: new Date(),
    },
};
const schema = {
    primitive: 'object',
    properties: {
        hello: 'string',
        foo: {
            primitive: 'boolean',
        },
        boo: {
            primitive: 'enum',
            optional: true,
            values: ['an-option'],
        },
        moo: {
            primitive: 'object',
            properties: {
                aaa: {
                    primitive: 'string',
                    values: ['a', 'b'],
                },
                bbb: {
                    primitive: 'array',
                    item: 'string',
                    values: ['a', 'b'],
                },
                ccc: {
                    primitive: 'any',
                },
            },
        },
    },
};
index_js_1.default.ensure(obj, schema);
//# sourceMappingURL=run.js.map