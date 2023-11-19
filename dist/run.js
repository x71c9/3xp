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
const obj = {
    hello: 'world',
    foo: true,
    moo: {
        aaa: 'a',
        bbb: [true, false],
        ccc: new Date(),
    },
};
const schema = {
    type: 'object',
    schema: {
        hello: 'string',
        foo: {
            type: 'boolean',
        },
        boo: {
            type: 'number',
            optional: true,
        },
        moo: {
            type: 'object',
            schema: {
                aaa: {
                    type: 'string',
                    options: ['a', 'b'],
                },
                bbb: {
                    type: 'boolean',
                    array: true,
                },
                ccc: {
                    type: 'any',
                },
            },
        },
    },
};
index_js_1.default.validate(obj, schema);
//# sourceMappingURL=run.js.map