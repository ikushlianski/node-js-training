export function logMethodInfo(loggerFn: (...args: any[]) => void) {
  return function (
    target: any,
    name: string,
    descriptor: PropertyDescriptor,
  ): any {
    const originalFn = descriptor.value;

    if (typeof originalFn === 'function') {
      descriptor.value = function (...args: any[]) {
        const message = `
        Method: ${name}
        Arguments: ${[...args]}
        `;
        loggerFn(message);

        return originalFn.apply(this, args);
      };
    }

    return descriptor;
  };
}
