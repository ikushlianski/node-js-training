import express from 'express';
import dotenv from 'dotenv';

import { expressErrorHandler } from './errors/error.handler';
import {userController} from "./entities/user/user.route";

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
