export function logMethodInfo(loggerFn: (...args: any[]) => void) {
  return function (
    target: any,
    name: string,
    descriptor: PropertyDescriptor,
  ): any {
    const originalFn = descriptor.value;

    if (typeof originalFn === 'function') {
      descriptor.value = async function (...args: any[]) {
        const message = `
        Method: ${name}
        Arguments: ${[...args]}
        `;
        loggerFn(message);

        return new Promise(async (resolve, reject) => {
          try {
            console.time('execTime');
            const result = await originalFn.apply(this, args);
            console.timeEnd('execTime');

            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      };
    }

    return descriptor;
  };
}
