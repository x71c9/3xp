# 3xp

A typescript library for validation objects

## How to use it

```typescript
import exp from '3xp';

const obj = {
        foo: 'a',
        boo: 1
    };

const schema = {
        foo: 'string',
        boo: {
                type: 'number',
                optional: true
            }
    };

exp.validate(obj, schema);
```
