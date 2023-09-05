/**
 *
 * Utils module
 *
 * @packageDocumentation
 *
 */

export function deep_clone<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}
