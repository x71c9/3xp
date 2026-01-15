import * as exp from '../src/main';

describe('parse', () => {
  describe('Success cases', () => {
    it('should return success for valid simple object', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number'
        }
      } as const;

      const result = exp.parse({name: 'John', age: 30}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });

    it('should return success for object with optional field present', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          email: {
            primitive: 'string',
            optional: true
          }
        }
      } as const;

      const result = exp.parse({name: 'John', email: 'john@example.com'}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });

    it('should return success for object with optional field missing', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          email: {
            primitive: 'string',
            optional: true
          }
        }
      } as const;

      const result = exp.parse({name: 'John'}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });

    it('should return success for valid nested object', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: 'string',
              age: 'number'
            }
          }
        }
      } as const;

      const result = exp.parse({user: {name: 'John', age: 30}}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });

    it('should return success for valid array', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            item: 'string'
          }
        }
      } as const;

      const result = exp.parse({items: ['a', 'b', 'c']}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });

    it('should return success with exact=false and extra properties', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string'
        }
      } as const;

      const result = exp.parse({name: 'John', extra: 'field'}, schema, false);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.errors).toEqual([]);
      }
    });
  });

  describe('Single error cases', () => {
    it('should return error for missing required field', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number'
        }
      } as const;

      const result = exp.parse({name: 'John'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('age');
        expect(result.errors[0].message).toContain('Missing required attribute');
      }
    });

    it('should return error for wrong type', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number'
        }
      } as const;

      const result = exp.parse({name: 'John', age: 'thirty'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('age');
        expect(result.errors[0].message).toContain('invalid type');
      }
    });

    it('should return error for additional property in exact mode', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string'
        }
      } as const;

      const result = exp.parse({name: 'John', extra: 'field'}, schema, true);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('extra');
        expect(result.errors[0].message).toContain('additional attributes');
      }
    });

    it('should return error for invalid enum value', () => {
      const schema = {
        primitive: 'object',
        properties: {
          status: {
            primitive: 'string',
            values: ['active', 'inactive'] as const
          }
        }
      } as const;

      const result = exp.parse({status: 'invalid'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('status');
        expect(result.errors[0].message).toContain('possible values');
      }
    });

    it('should return error for empty required string', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string'
        }
      } as const;

      const result = exp.parse({name: ''}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('name');
        expect(result.errors[0].message).toContain('cannot be empty');
      }
    });
  });

  describe('Multiple errors cases', () => {
    it('should collect multiple missing field errors', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number',
          email: 'string'
        }
      } as const;

      const result = exp.parse({}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(3);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('name');
        expect(paths).toContain('age');
        expect(paths).toContain('email');
      }
    });

    it('should collect errors from multiple fields with wrong types', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number',
          active: 'boolean'
        }
      } as const;

      const result = exp.parse({name: 123, age: 'thirty', active: 'yes'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(3);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('name');
        expect(paths).toContain('age');
        expect(paths).toContain('active');
      }
    });

    it('should collect errors mixing missing and wrong type', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          age: 'number',
          email: 'string'
        }
      } as const;

      const result = exp.parse({name: 123}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('name');
        expect(paths).toContain('age');
        expect(paths).toContain('email');
      }
    });
  });

  describe('Nested object errors', () => {
    it('should collect errors from nested objects', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: 'string',
              age: 'number'
            }
          }
        }
      } as const;

      const result = exp.parse({user: {name: 'John'}}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('age');
        expect(result.errors[0].message).toContain('Missing required attribute');
      }
    });

    it('should collect multiple errors from nested objects', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: 'string',
              age: 'number',
              email: 'string'
            }
          }
        }
      } as const;

      const result = exp.parse({user: {name: 'John'}}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('age');
        expect(paths).toContain('email');
      }
    });

    it('should handle type mismatch on nested object', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: 'string'
            }
          }
        }
      } as const;

      const result = exp.parse({user: 'not an object'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].path).toBe('user');
        expect(result.errors[0].message).toContain('invalid type');
      }
    });
  });

  describe('Array validation', () => {
    it('should return error for wrong array type', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            item: 'string'
          }
        }
      } as const;

      const result = exp.parse({items: 'not an array'}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('items');
        expect(result.errors[0].message).toContain('must be an array');
      }
    });

    it('should collect errors from multiple array elements', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            item: {
              primitive: 'object',
              properties: {
                id: 'number',
                name: 'string'
              }
            }
          }
        }
      } as const;

      const result = exp.parse({
        items: [
          {id: 1, name: 'First'},
          {id: 'wrong', name: 'Second'},
          {name: 'Third'}
        ]
      }, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThanOrEqual(2);

        // The paths will be just the property names like 'id', not full paths like 'items[1].id'
        // This matches the behavior of the original ensure() function
        const paths = result.errors.map(e => e.path);
        expect(paths.filter(p => p === 'id').length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should collect errors from array enum values', () => {
      const schema = {
        primitive: 'object',
        properties: {
          tags: {
            primitive: 'array',
            item: 'string',
            values: ['tag1', 'tag2', 'tag3'] as const
          }
        }
      } as const;

      const result = exp.parse({tags: ['tag1', 'invalid', 'tag2', 'bad']}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        expect(result.errors[0].path).toBe('tags[1]');
        expect(result.errors[1].path).toBe('tags[3]');
      }
    });
  });

  describe('Deep nesting', () => {
    it('should collect errors from deeply nested structures', () => {
      const schema = {
        primitive: 'object',
        properties: {
          level1: {
            primitive: 'object',
            properties: {
              level2: {
                primitive: 'object',
                properties: {
                  level3: {
                    primitive: 'string'
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
            level3: 123
          }
        }
      }, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('level3');
        expect(result.errors[0].message).toContain('invalid type');
      }
    });

    it('should collect multiple errors at different nesting levels', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string',
          user: {
            primitive: 'object',
            properties: {
              email: 'string',
              profile: {
                primitive: 'object',
                properties: {
                  bio: 'string'
                }
              }
            }
          }
        }
      } as const;

      const result = exp.parse({
        user: {
          profile: {}
        }
      }, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('name');
        expect(paths).toContain('email');
        expect(paths).toContain('bio');
      }
    });
  });

  describe('Type narrowing', () => {
    it('should enable TypeScript type narrowing on success', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string'
        }
      } as const;

      const result = exp.parse({name: 'John'}, schema);

      if (result.success) {
        expect(result.errors).toEqual([]);
      } else {
        fail('Should have succeeded');
      }
    });

    it('should enable TypeScript type narrowing on failure', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: 'string'
        }
      } as const;

      const result = exp.parse({}, schema);

      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      } else {
        fail('Should have failed');
      }
    });
  });
});
