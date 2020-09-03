import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors';
import { userController } from './entities/user';
import { sequelizeConnection } from './db';

dotenv.config();

const PORT = process.env.PORT;
const app = express();
const appRouter = express.Router();

app.use(express.json());
appRouter.use('/api', [userController]);
app.use(appRouter);

app.use(expressErrorHandler);

sequelizeConnection
  .sync({ force: process.env.SEQUELIZE_FORCE_SYNC === 'true' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
