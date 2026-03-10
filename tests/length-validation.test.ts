import * as exp from '../src/main';

describe('Length validation (minLength and maxLength)', () => {
  describe('String minLength validation', () => {
    it('should pass when string meets minLength requirement', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 3
          }
        }
      } as const;

      const result = exp.parse({name: 'abc'}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when string exceeds minLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 3
          }
        }
      } as const;

      const result = exp.parse({name: 'abcdef'}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when string is shorter than minLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 5
          }
        }
      } as const;

      const result = exp.parse({name: 'abc'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('name');
        expect(result.errors[0].message).toContain('minimum length of 5');
        expect(result.errors[0].message).toContain('has length 3');
      }
    });

    it('should fail when string is empty and minLength is set', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 1,
            optional: true
          }
        }
      } as const;

      const result = exp.parse({name: ''}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length');
      }
    });
  });

  describe('String maxLength validation', () => {
    it('should pass when string is at maxLength boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({code: 'abcde'}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when string is shorter than maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            maxLength: 10
          }
        }
      } as const;

      const result = exp.parse({code: 'abc'}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when string exceeds maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({code: 'toolongstring'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('code');
        expect(result.errors[0].message).toContain('maximum length of 5');
        expect(result.errors[0].message).toContain('has length 13');
      }
    });
  });

  describe('String minLength and maxLength combined', () => {
    it('should pass when string is within range', () => {
      const schema = {
        primitive: 'object',
        properties: {
          username: {
            primitive: 'string',
            minLength: 3,
            maxLength: 20
          }
        }
      } as const;

      const result = exp.parse({username: 'validuser'}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when string is at lower boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          username: {
            primitive: 'string',
            minLength: 3,
            maxLength: 20
          }
        }
      } as const;

      const result = exp.parse({username: 'abc'}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when string is at upper boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          username: {
            primitive: 'string',
            minLength: 3,
            maxLength: 20
          }
        }
      } as const;

      const result = exp.parse({username: 'a'.repeat(20)}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when string is too short', () => {
      const schema = {
        primitive: 'object',
        properties: {
          username: {
            primitive: 'string',
            minLength: 3,
            maxLength: 20
          }
        }
      } as const;

      const result = exp.parse({username: 'ab'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length of 3');
      }
    });

    it('should fail when string is too long', () => {
      const schema = {
        primitive: 'object',
        properties: {
          username: {
            primitive: 'string',
            minLength: 3,
            maxLength: 20
          }
        }
      } as const;

      const result = exp.parse({username: 'a'.repeat(21)}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('maximum length of 20');
      }
    });
  });

  describe('Array minLength validation', () => {
    it('should pass when array meets minLength requirement', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2]}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when array exceeds minLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3, 4]}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when array is shorter than minLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          tags: {
            primitive: 'array',
            minLength: 3
          }
        }
      } as const;

      const result = exp.parse({tags: ['a', 'b']}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('tags');
        expect(result.errors[0].message).toContain('minimum length of 3');
        expect(result.errors[0].message).toContain('has length 2');
      }
    });

    it('should fail when array is empty and minLength is set', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 1
          }
        }
      } as const;

      const result = exp.parse({items: []}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length');
      }
    });
  });

  describe('Array maxLength validation', () => {
    it('should pass when array is at maxLength boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3]}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when array is shorter than maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2]}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when array exceeds maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          tags: {
            primitive: 'array',
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({tags: [1, 2, 3, 4, 5]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('tags');
        expect(result.errors[0].message).toContain('maximum length of 3');
        expect(result.errors[0].message).toContain('has length 5');
      }
    });
  });

  describe('Array minLength and maxLength combined', () => {
    it('should pass when array is within range', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3]}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when array is at lower boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2]}, schema);
      expect(result.success).toBe(true);
    });

    it('should pass when array is at upper boundary', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3, 4, 5]}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when array is too short', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length of 2');
      }
    });

    it('should fail when array is too long', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3, 4, 5, 6]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('maximum length of 5');
      }
    });
  });

  describe('Multiple validation errors', () => {
    it('should collect both string and array length errors', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 5
          },
          tags: {
            primitive: 'array',
            minLength: 2
          }
        }
      } as const;

      const result = exp.parse({name: 'ab', tags: ['one']}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('name');
        expect(paths).toContain('tags');
      }
    });

    it('should collect both min and max errors if both violated', () => {
      const schema = {
        primitive: 'object',
        properties: {
          short: {
            primitive: 'string',
            minLength: 5
          },
          long: {
            primitive: 'string',
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({short: 'abc', long: 'toolong'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        const paths = result.errors.map(e => e.path);
        expect(paths).toContain('short');
        expect(paths).toContain('long');
      }
    });
  });

  describe('Length validation with item schemas', () => {
    it('should validate both array length and item type', () => {
      const schema = {
        primitive: 'object',
        properties: {
          numbers: {
            primitive: 'array',
            item: 'number',
            minLength: 2,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({numbers: [1, 2, 3]}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail for length violation even if items are valid', () => {
      const schema = {
        primitive: 'object',
        properties: {
          numbers: {
            primitive: 'array',
            item: 'number',
            maxLength: 2
          }
        }
      } as const;

      const result = exp.parse({numbers: [1, 2, 3]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].message).toContain('maximum length');
      }
    });

    it('should collect both item and length errors', () => {
      const schema = {
        primitive: 'object',
        properties: {
          numbers: {
            primitive: 'array',
            item: 'number',
            minLength: 3
          }
        }
      } as const;

      const result = exp.parse({numbers: ['not', 'numbers']}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Nested object length validation', () => {
    it('should validate length in nested objects', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: {
                primitive: 'string',
                minLength: 3,
                maxLength: 20
              }
            }
          }
        }
      } as const;

      const result = exp.parse({user: {name: 'validname'}}, schema);
      expect(result.success).toBe(true);
    });

    it('should collect errors from nested object length validation', () => {
      const schema = {
        primitive: 'object',
        properties: {
          user: {
            primitive: 'object',
            properties: {
              name: {
                primitive: 'string',
                minLength: 10
              }
            }
          }
        }
      } as const;

      const result = exp.parse({user: {name: 'short'}}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('name');
        expect(result.errors[0].message).toContain('minimum length');
      }
    });
  });

  describe('Optional fields with length validation', () => {
    it('should skip length validation when optional field is undefined', () => {
      const schema = {
        primitive: 'object',
        properties: {
          bio: {
            primitive: 'string',
            minLength: 10,
            optional: true
          }
        }
      } as const;

      const result = exp.parse({}, schema);
      expect(result.success).toBe(true);
    });

    it('should validate length when optional field is present', () => {
      const schema = {
        primitive: 'object',
        properties: {
          bio: {
            primitive: 'string',
            minLength: 10,
            optional: true
          }
        }
      } as const;

      const result = exp.parse({bio: 'short'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length of 10');
      }
    });
  });

  describe('Exact length validation (minLength === maxLength)', () => {
    it('should pass when string has exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            minLength: 5,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({code: 'abcde'}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when string is shorter than exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            minLength: 5,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({code: 'abcd'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length of 5');
      }
    });

    it('should fail when string is longer than exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          code: {
            primitive: 'string',
            minLength: 5,
            maxLength: 5
          }
        }
      } as const;

      const result = exp.parse({code: 'abcdef'}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('maximum length of 5');
      }
    });

    it('should pass when array has exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 3,
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3]}, schema);
      expect(result.success).toBe(true);
    });

    it('should fail when array is shorter than exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 3,
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('minimum length of 3');
      }
    });

    it('should fail when array is longer than exact length', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            minLength: 3,
            maxLength: 3
          }
        }
      } as const;

      const result = exp.parse({items: [1, 2, 3, 4]}, schema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('maximum length of 3');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle minLength of 0', () => {
      const schema = {
        primitive: 'object',
        properties: {
          name: {
            primitive: 'string',
            minLength: 0,
            optional: true
          }
        }
      } as const;

      const result = exp.parse({name: ''}, schema);
      expect(result.success).toBe(true);
    });

    it('should handle very large strings within maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          content: {
            primitive: 'string',
            maxLength: 1000
          }
        }
      } as const;

      const result = exp.parse({content: 'a'.repeat(999)}, schema);
      expect(result.success).toBe(true);
    });

    it('should handle very large arrays within maxLength', () => {
      const schema = {
        primitive: 'object',
        properties: {
          items: {
            primitive: 'array',
            maxLength: 100
          }
        }
      } as const;

      const result = exp.parse({items: Array(99).fill(1)}, schema);
      expect(result.success).toBe(true);
    });
  });
});
