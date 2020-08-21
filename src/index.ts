import express from 'express';
import dotenv from 'dotenv';
import { expressErrorHandler } from './errors/error.handler';

dotenv.config();

const app = express();
const router = express.Router();

app.use(router);

app.use(expressErrorHandler);

app.listen(process.env.PORT, () => {
  console.log('listening');
});
