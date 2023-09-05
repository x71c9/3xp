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
        bbb: [true, false]
    },
};
const schema = {
    type: 'object',
    schema: {
        hello: 'string',
        foo: {
            type: 'boolean'
        },
        boo: {
            type: 'number',
            optional: true
        },
        moo: {
            type: 'object',
            schema: {
                aaa: {
                    type: 'string',
                    options: ['a', 'b']
                },
                bbb: {
                    type: 'boolean',
                    array: true
                }
            }
        }
    }
};
exp.validate(obj, schema);
//# sourceMappingURL=run.js.map