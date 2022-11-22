/**
 * Parse url string into WHATWG URL API Object
 * @param val
 * @returns
 */
export function parse(val: string): URL {
  const url = new URL(val, 'http://example.com'); // TODO: better base?
  return url;
}
