export function* integers(end: number, start: number = 0, step: number = 1): Generator<number> {
  while (start < end) {
    yield start
    start += step
  }
}

export function* map<T, R>(
  itr: Iterable<T>,
  callback: (value: T, index: number) => R
): Generator<R> {
  let i = 0
  for (const value of itr) {
    yield callback(value, i++)
  }
}

export function reduce<T, R>(
  itr: Iterable<T>,
  callback: (acc: R, value: T, index: number) => R,
  acc: R
): R {
  let i = 0
  for (const value of itr) {
    acc = callback(acc, value, i++)
  }
  return acc
}

export function take<T>(itr: Iterable<T>, amount: number): T[] {
  const result: T[] = []
  for (const value of itr) {
    if (result.length >= amount) break
    result.push(value)
  }
  return result
}
