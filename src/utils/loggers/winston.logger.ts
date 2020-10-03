import { createLogger, format, transports } from 'winston';
import { LogLevels } from '../log-level.enum';
import { stripUserData } from '../sanitize-user-data.util';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(label({ label: 'Winston' }), timestamp(), logFormat),
});

export function winstonLogger(message: string, level = LogLevels.info): void {
  const sanitizedMessage = stripUserData(message);

  logger.log({
    level,
    message: sanitizedMessage,
  });
}
