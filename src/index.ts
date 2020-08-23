import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors/error.handler';
import { userController } from './user/user.controller';

dotenv.config();

const app = express();
export const appRouter = express.Router();

appRouter.use('/api', [userController]);
app.use(appRouter);

app.use(expressErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
