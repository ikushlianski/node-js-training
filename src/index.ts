import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors';
import { userController } from './entities/user';

dotenv.config();

const app = express();
const appRouter = express.Router();

app.use(express.json());
appRouter.use('/api', [userController]);
app.use(appRouter);

app.use(expressErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
