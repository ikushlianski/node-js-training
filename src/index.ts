import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors';
import { userController } from './entities/user';
import { groupController } from './entities/group';
import { sequelizeConnection } from './db';

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();
const appRouter = express.Router();

app.use(express.json());
appRouter.use('/api', [userController, groupController]);
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
