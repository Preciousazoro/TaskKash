// Simple timeout utility that avoids TypeScript Promise constructor issues

export function createTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    createTimeoutPromise(timeoutMs)
  ]);
}

export function aggregateWithTimeout<T>(
  aggregatePromise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return withTimeout(aggregatePromise, timeoutMs);
}
