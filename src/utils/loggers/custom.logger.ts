enum ConsoleMethods {
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export function customLogger(arg: string, method = ConsoleMethods.info): void {
  console[method](
    `
  [Custom logger] `,
    arg,
  );
}
