import { LogLevels } from '../log-level.enum';

export function customLogger(arg: string, method = LogLevels.info): void {
  console[method](
    `
  [Custom logger] `,
    arg,
  );
}
