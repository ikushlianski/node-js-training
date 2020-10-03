type LogMethodInfo = (loggerFn: (...args: any[]) => void) => any;

export const logMethodInfo: LogMethodInfo = (loggerFn) => {
  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalFn = descriptor.value;

    if (typeof originalFn === 'function') {
      descriptor.value = async function (...args: any[]) {
        const message = `
        Method: ${methodName}
        Arguments: ${args.map((arg) => JSON.stringify(arg))}
        `;
        loggerFn(message);

        return new Promise(async (resolve, reject) => {
          try {
            console.time(`Execution time for ${methodName}`);

            const result = await originalFn.apply(this, args);

            resolve(result);
          } catch (e) {
            reject(e);
          } finally {
            console.timeEnd(`Execution time for ${methodName}`);
          }
        });
      };
    }

    return descriptor;
  };
};
