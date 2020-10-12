import express from 'express';

import { loginController } from './login.controller';
import { tokenController } from './token.controller';
import { logoutController } from './logout.controller';
import { invalidateController } from './invalidate.controller';

export const authRouter = express.Router();

authRouter.route('/login').post(loginController);

authRouter.route('/logout').post(logoutController);

authRouter.route('/token').post(tokenController).delete(invalidateController);
