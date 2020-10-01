import { createLogger, format, transports } from 'winston';
import { LogLevels } from '../log-level.enum';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(label({ label: 'Winston' }), timestamp(), logFormat),
});

export function winstonLogger(message: string, level = LogLevels.info): void {
  logger.log({
    level,
    message,
  });
}
