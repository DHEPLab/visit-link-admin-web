export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const self = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(self, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(self, args);
  };
}
