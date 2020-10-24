import { Response, Request } from 'express';
import {
  createUser,
  getUserById,
  getUserSuggestions,
  softDeleteUser,
  updateUser,
} from './user.controller';
import { ErrorCodes } from '../../errors';
import { userService } from './user.service';
import { UserModel } from '../../db/models';

describe('User Controller', () => {
  let req: Request, res: Response;

  beforeEach(() => {
    req = {
      url: 'http://localhost:3000/api/users',
    } as Request;

    res = ({
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown) as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSuggestions', () => {
    it('should return 400 if query params are not provided', async () => {
      await getUserSuggestions(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.BadRequest);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call user service with username', async () => {
      const userModels = (['user1', 'user2'] as unknown) as UserModel[];
      req.url = 'http://localhost:3000/api/users?username="user"';

      jest
        .spyOn(userService, 'suggest')
        .mockImplementation(() => Promise.resolve(userModels));
      await getUserSuggestions(req, res);

      expect(userService.suggest).toHaveBeenCalledWith(`"user"`, 10);
    });

    it('should call user service with custom limit if it is in query params', async () => {
      const userModels = (['user1', 'user2'] as unknown) as UserModel[];
      const expectedLimit = 2;
      req.url = `http://localhost:3000/api/users?username="user"&limit=${expectedLimit}`;

      jest
        .spyOn(userService, 'suggest')
        .mockImplementation(() => Promise.resolve(userModels));
      await getUserSuggestions(req, res);

      expect(userService.suggest).toHaveBeenCalledWith(`"user"`, expectedLimit);
    });

    it('should call res.send with list of users', async () => {
      const userModels = (['user1', 'user2'] as unknown) as UserModel[];
      req.url = `http://localhost:3000/api/users?username="user"`;

      jest
        .spyOn(userService, 'suggest')
        .mockImplementation(() => Promise.resolve(userModels));
      await getUserSuggestions(req, res);

      expect(res.send).toHaveBeenCalledWith(userModels);
    });

    it('should call res.send with Internal Server Error if user service throws error', async () => {
      req.url = `http://localhost:3000/api/users?username="user"`;

      const errorMsg = 'some error';

      jest
        .spyOn(userService, 'suggest')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await getUserSuggestions(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.InternalServerError);
      expect(res.sendStatus).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return 400 if no user id was supplied in params', async () => {
      req.params = {
        userId: '',
      };
      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.BadRequest);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no user found in db', async () => {
      req.params = {
        userId: '1',
      };

      jest
        .spyOn(userService, 'getById')
        .mockImplementation(() => Promise.resolve(null));

      await getUserById(req, res);

      expect(res.send).toHaveBeenCalledWith([]);
    });

    it('should return user if they were found in db', async () => {
      req.params = {
        userId: '1',
      };

      const user = ({ name: 'user' } as unknown) as UserModel;

      jest
        .spyOn(userService, 'getById')
        .mockImplementation(() => Promise.resolve(user));

      await getUserById(req, res);

      expect(res.send).toHaveBeenCalledWith(user);
    });

    it('should call res.send with Error status 500 if user service throws error', async () => {
      req.params = {
        userId: '1',
      };

      const errorMsg = 'some error';

      jest
        .spyOn(userService, 'getById')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await getUserById(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.InternalServerError);
    });
  });

  describe('createUser', () => {
    it('should call user service with user data', async () => {
      req.body = { login: 'login', password: 'password', age: 44 };
      const createdUser = ({
        ...req.body,
        id: 'some-id',
        isDeleted: false,
      } as unknown) as UserModel;

      jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.resolve(createdUser));

      await createUser(req, res);

      expect(userService.create).toHaveBeenCalledWith(req.body);
    });

    it('should call res.send with Error status 500 if create user operation throws error', async () => {
      req.body = {};

      const errorMsg = 'some error';

      jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await createUser(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.InternalServerError);
    });
  });

  describe('updateUser', () => {
    it('should call user service with user data', async () => {
      req.params = {
        userId: '1',
      };
      req.body = { login: 'login', password: 'password', age: 44 } as UserModel;

      jest.spyOn(userService, 'update').mockImplementation(() =>
        Promise.resolve({
          ...req.body,
          id: '1',
          isDeleted: false,
        }),
      );

      await updateUser(req, res);

      expect(userService.update).toHaveBeenCalledWith(req.body, '1');
    });

    it('should return 404 if user to update was not in DB', async () => {
      req.params = {
        userId: '1',
      };
      req.body = { login: 'login', password: 'password', age: 44 } as UserModel;

      jest
        .spyOn(userService, 'update')
        .mockImplementation(() => Promise.resolve(null));

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.NotFound);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with Error status 500 if update user operation throws error', async () => {
      req.params = {
        userId: '1',
      };
      req.body = {};

      const errorMsg = 'some error';

      jest
        .spyOn(userService, 'update')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await updateUser(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.InternalServerError);
    });
  });

  describe('softDeleteUser', () => {
    it('should call user service with user id', async () => {
      req.params = {
        userId: '1',
      };

      jest.spyOn(userService, 'softDelete').mockImplementation(() =>
        Promise.resolve({
          ...req.body,
          id: '1',
          isDeleted: true,
        }),
      );

      await softDeleteUser(req, res);

      expect(userService.softDelete).toHaveBeenCalledWith('1');
    });

    it('should return 404 if user to delete was not in DB', async () => {
      req.params = {
        userId: '1',
      };

      jest
        .spyOn(userService, 'softDelete')
        .mockImplementation(() => Promise.resolve(null));

      await softDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.NotFound);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with Error status 500 if delete user operation throws error', async () => {
      req.params = {
        userId: '1',
      };

      const errorMsg = 'some error';

      jest
        .spyOn(userService, 'softDelete')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await softDeleteUser(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.InternalServerError);
    });
  });
});
