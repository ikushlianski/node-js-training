import { LogLevels } from '../log-level.enum';

type LogMethodInfo = (loggerFn: (...args: any[]) => void) => any;

export const logMethodInfo: LogMethodInfo = (loggerFn) => {
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
          console.time(`execTime for ${name}`);
          let result;

          try {
            result = await originalFn.apply(this, args);

            if (result instanceof Error) {
              throw result;
            }

            resolve(result);
          } catch (e) {
            loggerFn(`Method: ${name}. Error: ${e.message}`, LogLevels.error);

            return resolve(e);
          } finally {
            console.timeEnd(`execTime for ${name}`);
            resolve(result);
          }
        });
      };
    }

    return descriptor;
  };
};
