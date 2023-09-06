/**
 *
 * Run module
 *
 */
import exp from './index.js';
const obj = {
    hello: 'world',
    foo: true,
    moo: {
        aaa: 'a',
        bbb: [true, false],
        ccc: new Date
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
                    type: 'any'
                }
            },
        },
    },
};
exp.validate(obj, schema);
//# sourceMappingURL=run.js.map