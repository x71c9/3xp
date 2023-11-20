/**
 *
 * Run module
 *
 */

import exp from './index.js';
exp.config.set({debug: true});

const obj: any = {
  hello: 'world',
  foo: true,
  moo: {
    aaa: 'a',
    bbb: ['a', 'b', 'a'],
    ccc: new Date(),
  },
};

const schema: exp.Schema = {
  primitive: 'object',
  properties: {
    hello: 'string',
    foo: {
      primitive: 'boolean',
    },
    boo: {
      primitive: 'number',
      optional: true,
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

exp.asserts(obj, schema);
