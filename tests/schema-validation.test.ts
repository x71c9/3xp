import * as exp from '../src/main';

describe('Schema validation errors', () => {
  it('should throw error for schema missing primitive', () => {
    const invalidSchema = {
      primitive: 'object',
      properties: {
        name: {} as any  // Missing primitive
      }
    };

    expect(() => {
      exp.parse({name: 'test'}, invalidSchema as any);
    }).toThrow("missing the required 'primitive' attribute");
  });

  it('should throw error for invalid primitive type', () => {
    const invalidSchema = {
      primitive: 'object',
      properties: {
        name: {
          primitive: 'invalid-type' as any
        }
      }
    };

    expect(() => {
      exp.parse({name: 'test'}, invalidSchema as any);
    }).toThrow("invalid 'primitive' attribute value");
  });

  it('should throw error for invalid optional value', () => {
    const invalidSchema = {
      primitive: 'object',
      properties: {
        name: {
          primitive: 'string',
          optional: 'yes' as any  // Should be boolean
        }
      }
    };

    expect(() => {
      exp.parse({name: 'test'}, invalidSchema as any);
    }).toThrow("invalid 'optional' attribute");
  });

  it('should throw error for non-array values in enum', () => {
    const invalidSchema = {
      primitive: 'object',
      properties: {
        status: {
          primitive: 'enum',
          values: 'active' as any  // Should be array
        }
      }
    };

    expect(() => {
      exp.parse({status: 'active'}, invalidSchema as any);
    }).toThrow();
  });

  it('should throw error for empty values array in enum', () => {
    const invalidSchema = {
      primitive: 'object',
      properties: {
        status: {
          primitive: 'enum',
          values: []
        }
      }
    };

    expect(() => {
      exp.parse({status: 'active'}, invalidSchema as any);
    }).toThrow('invalid possible values');
  });

  it('should validate values in values array', () => {
    const schema = {
      primitive: 'object',
      properties: {
        count: {
          primitive: 'number',
          values: [1, 2, 3] as const
        }
      }
    } as const;

    expect(exp.parse({count: 1}, schema).success).toBe(true);
    expect(exp.parse({count: 4}, schema).success).toBe(false);
  });
});

describe('Edge cases in validation', () => {
  it('should handle undefined primitive type', () => {
    const schema = {
      primitive: 'object',
      properties: {
        value: {
          primitive: 'undefined',
          optional: true
        }
      }
    } as const;

    const result = exp.parse({}, schema);
    expect(result.success).toBe(true);
  });

  it('should handle any primitive type', () => {
    const schema = {
      primitive: 'object',
      properties: {
        value: 'any'
      }
    } as const;

    expect(exp.parse({value: 'string'}, schema).success).toBe(true);
    expect(exp.parse({value: 123}, schema).success).toBe(true);
    expect(exp.parse({value: true}, schema).success).toBe(true);
    expect(exp.parse({value: null}, schema).success).toBe(true);
    expect(exp.parse({value: {}}, schema).success).toBe(true);
  });

  it('should handle unknown primitive type', () => {
    const schema = {
      primitive: 'object',
      properties: {
        value: 'unknown'
      }
    } as const;

    expect(exp.parse({value: 'string'}, schema).success).toBe(true);
    expect(exp.parse({value: 123}, schema).success).toBe(true);
    expect(exp.parse({value: {}}, schema).success).toBe(true);
  });

  it('should validate enum with mixed number and string values', () => {
    const schema = {
      primitive: 'object',
      properties: {
        value: {
          primitive: 'enum',
          values: [1, 2, 'three', 'four'] as const
        }
      }
    } as const;

    expect(exp.parse({value: 1}, schema).success).toBe(true);
    expect(exp.parse({value: 'three'}, schema).success).toBe(true);
    expect(exp.parse({value: 3}, schema).success).toBe(false);
    expect(exp.parse({value: 'five'}, schema).success).toBe(false);
  });

  it('should handle deeply nested objects with length validation', () => {
    const schema = {
      primitive: 'object',
      properties: {
        level1: {
          primitive: 'object',
          properties: {
            level2: {
              primitive: 'object',
              properties: {
                name: {
                  primitive: 'string',
                  minLength: 3
                }
              }
            }
          }
        }
      }
    } as const;

    const result = exp.parse({
      level1: {
        level2: {
          name: 'ab'
        }
      }
    }, schema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0].message).toContain('minimum length');
    }
  });

  it('should validate array of objects with length constraints', () => {
    const schema = {
      primitive: 'object',
      properties: {
        items: {
          primitive: 'array',
          minLength: 2,
          maxLength: 4,
          item: {
            primitive: 'object',
            properties: {
              id: 'number',
              name: {
                primitive: 'string',
                minLength: 3
              }
            }
          }
        }
      }
    } as const;

    // Valid case
    expect(exp.parse({
      items: [
        {id: 1, name: 'abc'},
        {id: 2, name: 'def'}
      ]
    }, schema).success).toBe(true);

    // Array too short
    expect(exp.parse({
      items: [{id: 1, name: 'abc'}]
    }, schema).success).toBe(false);

    // String in item too short
    expect(exp.parse({
      items: [
        {id: 1, name: 'ab'},
        {id: 2, name: 'def'}
      ]
    }, schema).success).toBe(false);
  });

  it('should handle optional string with length constraints when undefined', () => {
    const schema = {
      primitive: 'object',
      properties: {
        description: {
          primitive: 'string',
          optional: true,
          minLength: 10,
          maxLength: 100
        }
      }
    } as const;

    // Undefined should pass
    expect(exp.parse({}, schema).success).toBe(true);

    // Valid length should pass
    expect(exp.parse({description: 'This is long enough'}, schema).success).toBe(true);

    // Too short should fail
    expect(exp.parse({description: 'short'}, schema).success).toBe(false);
  });

  it('should handle optional array with length constraints when undefined', () => {
    const schema = {
      primitive: 'object',
      properties: {
        tags: {
          primitive: 'array',
          optional: true,
          minLength: 1,
          maxLength: 5
        }
      }
    } as const;

    // Undefined should pass
    expect(exp.parse({}, schema).success).toBe(true);

    // Valid length should pass
    expect(exp.parse({tags: ['a', 'b']}, schema).success).toBe(true);

    // Empty array should fail
    expect(exp.parse({tags: []}, schema).success).toBe(false);
  });
});
