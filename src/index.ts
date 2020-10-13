import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors';
import { userRouter } from './entities/user';
import { groupRouter } from './entities/group';
import { sequelizeConnection } from './db';
import { winstonLogger } from './utils/loggers';
import { LogLevels } from './utils';
import { loggerMiddleware } from './utils/loggers/logger.middleware';
import { authMiddleware, authRouter } from './auth';

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();
app.use(loggerMiddleware);

const appRouter = express.Router();

app.use(express.json());
appRouter.use('/api', authMiddleware, [userRouter, groupRouter]);
appRouter.use('/auth', [authRouter]);
app.use(appRouter);

app.use(expressErrorHandler);

sequelizeConnection
  .sync({
    force: process.env.SEQUELIZE_FORCE_SYNC === 'true',
    alter: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  });

process
  .on('unhandledRejection', (reason) => {
    winstonLogger(`Unhandled rejection: ${reason}`, LogLevels.error);
  })
  .on('uncaughtException', (err) => {
    winstonLogger(
      `Uncaught exception (${err.name}): ${err.message}`,
      LogLevels.error,
    );

    // not safe to continue
    process.exit(1);
  });
