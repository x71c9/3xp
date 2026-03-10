import * as exp from '../src/main';

describe('ensure', () => {
  it('should pass for valid object', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    expect(() => {
      exp.ensure({name: 'John', age: 30}, schema);
    }).not.toThrow();
  });

  it('should throw error for invalid object', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    expect(() => {
      exp.ensure({name: 'John', age: 'thirty'}, schema);
    }).toThrow();
  });

  it('should throw error for missing required field', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    expect(() => {
      exp.ensure({name: 'John'}, schema);
    }).toThrow('Missing required attribute');
  });

  it('should throw error on first validation error', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number',
        email: 'string'
      }
    } as const;

    expect(() => {
      exp.ensure({}, schema);
    }).toThrow();
  });

  it('should respect exact mode = true', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string'
      }
    } as const;

    expect(() => {
      exp.ensure({name: 'John', extra: 'field'}, schema, true);
    }).toThrow('additional attributes');
  });

  it('should respect exact mode = false', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string'
      }
    } as const;

    expect(() => {
      exp.ensure({name: 'John', extra: 'field'}, schema, false);
    }).not.toThrow();
  });

  it('should validate string length constraints', () => {
    const schema = {
      primitive: 'object',
      properties: {
        code: {
          primitive: 'string',
          minLength: 3,
          maxLength: 5
        }
      }
    } as const;

    expect(() => {
      exp.ensure({code: 'ab'}, schema);
    }).toThrow('minimum length');
  });

  it('should validate array length constraints', () => {
    const schema = {
      primitive: 'object',
      properties: {
        items: {
          primitive: 'array',
          maxLength: 2
        }
      }
    } as const;

    expect(() => {
      exp.ensure({items: [1, 2, 3]}, schema);
    }).toThrow('maximum length');
  });
});

describe('isValid', () => {
  it('should return true for valid object', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    const result = exp.isValid({name: 'John', age: 30}, schema);
    expect(result).toBe(true);
  });

  it('should return false for invalid object', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    const result = exp.isValid({name: 'John', age: 'thirty'}, schema);
    expect(result).toBe(false);
  });

  it('should return false for missing required field', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    const result = exp.isValid({name: 'John'}, schema);
    expect(result).toBe(false);
  });

  it('should work with exact mode = true', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string'
      }
    } as const;

    const result = exp.isValid({name: 'John', extra: 'field'}, schema, true);
    expect(result).toBe(false);
  });

  it('should work with exact mode = false', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string'
      }
    } as const;

    const result = exp.isValid({name: 'John', extra: 'field'}, schema, false);
    expect(result).toBe(true);
  });

  it('should validate length constraints', () => {
    const schema = {
      primitive: 'object',
      properties: {
        code: {
          primitive: 'string',
          minLength: 5
        }
      }
    } as const;

    expect(exp.isValid({code: 'abcdef'}, schema)).toBe(true);
    expect(exp.isValid({code: 'abc'}, schema)).toBe(false);
  });

  it('should handle type guard correctly', () => {
    const schema = {
      primitive: 'object',
      properties: {
        name: 'string',
        age: 'number'
      }
    } as const;

    const obj: unknown = {name: 'John', age: 30};

    if (exp.isValid(obj, schema)) {
      // TypeScript should narrow the type here
      expect(obj.name).toBe('John');
      expect(obj.age).toBe(30);
    }
  });
});

describe('config', () => {
  it('should allow setting debug mode', () => {
    expect(() => {
      exp.config.set({debug: true});
    }).not.toThrow();

    // Reset to false
    exp.config.set({debug: false});
  });

  it('should allow setting spinner', () => {
    const mockSpinner = {
      start: () => {},
      success: () => {},
      fail: () => {},
      stop: () => {}
    } as any;

    expect(() => {
      exp.config.set({spinner: mockSpinner});
    }).not.toThrow();

    // Reset to original
    exp.config.set({debug: false});
  });

  it('should allow setting both debug and spinner', () => {
    const mockSpinner = {
      start: () => {},
      success: () => {},
      fail: () => {},
      stop: () => {}
    } as any;

    expect(() => {
      exp.config.set({
        debug: true,
        spinner: mockSpinner
      });
    }).not.toThrow();

    // Reset
    exp.config.set({debug: false});
  });
});
