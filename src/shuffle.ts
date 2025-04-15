/**
 * Get a generator for a shuffled version of an array of anything
 * @param arr an array of anything
 * @returns a Generator of the shuffled array
 */
export default function* <T>(arr: T[]): Generator<T> {
  const _arr = JSON.parse(JSON.stringify(arr));
  while (_arr.length > 0) {
    const j = Math.floor(Math.random() * _arr.length);
    yield _arr.splice(j, 1)[0];
  }
}
