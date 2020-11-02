import { Request, Response } from 'express';

import { groupController } from './group.controller';
import { groupService } from './group.service';

import { ErrorCodes } from '../../errors';
import { GroupModel } from '../../db/models';

describe('Group Controller', () => {
  let req: Request, res: Response;

  beforeEach(() => {
    req = {
      url: 'http://localhost:3000/api/groups',
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

  describe('getGroups', () => {
    it('should call group service with custom limit if it is in query params', async () => {
      req.url = 'http://localhost:3000/api/groups?limit=2';

      jest
        .spyOn(groupService, 'getAll')
        .mockImplementation(() => Promise.resolve([]));
      await groupController.getGroups(req, res);

      expect(groupService.getAll).toHaveBeenCalledWith(2);
    });

    it('should call res.send with list of groups', async () => {
      const groups = (['group1', 'group2'] as unknown) as GroupModel[];

      jest
        .spyOn(groupService, 'getAll')
        .mockImplementation(() => Promise.resolve(groups));
      await groupController.getGroups(req, res);

      expect(res.send).toHaveBeenCalledWith(groups);
    });

    it('should call res.send with empty array if no groups were found in DB', async () => {
      const groups = ([] as unknown) as GroupModel[];

      jest
        .spyOn(groupService, 'getAll')
        .mockImplementation(() => Promise.resolve(groups));
      await groupController.getGroups(req, res);

      expect(res.send).toHaveBeenCalledWith([]);
    });

    it('should call res.send with Internal Server Error if group service throws error', async () => {
      const errorMsg = 'some error';

      jest
        .spyOn(groupService, 'getAll')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await groupController.getGroups(req, res);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGroupById', () => {
    it('should return 400 if no group id was supplied in params', async () => {
      req.params = {
        groupId: '',
      };
      await groupController.getGroupById(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.BadRequest);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no group was found in db', async () => {
      req.params = {
        groupId: '1',
      };

      jest
        .spyOn(groupService, 'getById')
        .mockImplementation(() => Promise.resolve(null));

      await groupController.getGroupById(req, res);

      expect(res.send).toHaveBeenCalledWith([]);
    });

    it('should return group if it exists in db', async () => {
      req.params = {
        groupId: '1',
      };

      const group = new GroupModel();

      const getByIdSpy = jest
        .spyOn(groupService, 'getById')
        .mockImplementation(() => Promise.resolve(group));

      await groupController.getGroupById(req, res);

      expect(res.send).toHaveBeenCalledWith(group);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with Error status 500 if group service throws error', async () => {
      req.params = {
        groupId: '1',
      };

      const errorMsg = 'some error';

      jest
        .spyOn(groupService, 'getById')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await groupController.getGroupById(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(
        ErrorCodes.InternalServerError,
      );
    });
  });

  describe('createGroup', () => {
    it('should call group service with group data', async () => {
      req.body = { name: 'name', permissions: '' };

      const createdGroup = new GroupModel();

      jest
        .spyOn(groupService, 'create')
        .mockImplementation(() => Promise.resolve(createdGroup));

      await groupController.createGroup(req, res);

      expect(groupService.create).toHaveBeenCalledWith(req.body);
    });

    it('should call res.send with Error status 500 if create group method throws error', async () => {
      req.body = {};

      const errorMsg = 'some error';

      jest
        .spyOn(groupService, 'create')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await groupController.createGroup(req, res);

      expect(res.send).toHaveBeenCalledWith(errorMsg);
      expect(res.status).toHaveBeenCalledWith(ErrorCodes.BadRequest);
    });
  });

  describe('updateGroup', () => {
    it('should call group service with user data', async () => {
      req.params = {
        groupId: '1',
      };

      req.body = { name: 'name', permissions: '' };

      jest.spyOn(groupService, 'update').mockImplementation(() =>
        Promise.resolve({
          ...req.body,
          id: '1',
        }),
      );

      await groupController.updateGroup(req, res);

      expect(groupService.update).toHaveBeenCalledWith(req.body, '1');
    });

    it('should return 404 if group to update was not in DB', async () => {
      req.params = {
        groupId: '1',
      };
      req.body = { name: 'name', permissions: '' };

      jest
        .spyOn(groupService, 'update')
        .mockImplementation(() => Promise.resolve(null));

      await groupController.updateGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.NotFound);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with Error status 500 if update group operation throws error', async () => {
      req.params = {
        groupId: '1',
      };
      req.body = {};

      const errorMsg = 'some error';

      jest
        .spyOn(groupService, 'update')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await groupController.updateGroup(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(
        ErrorCodes.InternalServerError,
      );
    });
  });

  describe('delete group', () => {
    it('should call delete method of group service with group id', async () => {
      const groupId = '313fe-632jsd-454t24-4t34';

      req.params = {
        groupId,
      };

      jest
        .spyOn(groupService, 'delete')
        .mockImplementation(() => Promise.resolve(1));

      await groupController.deleteOne(req, res);

      expect(groupService.delete).toHaveBeenCalledWith(groupId);
    });

    it('should return 404 if group to delete was not in DB', async () => {
      req.params = {
        groupId: '1',
      };

      jest
        .spyOn(groupService, 'delete')
        .mockImplementation(() => Promise.resolve(0));

      await groupController.deleteOne(req, res);

      expect(res.status).toHaveBeenCalledWith(ErrorCodes.NotFound);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with Error status 500 if delete group operation throws error', async () => {
      req.params = {
        groupId: '1',
      };

      const errorMsg = 'some error';

      jest
        .spyOn(groupService, 'delete')
        .mockImplementation(() => Promise.reject(new Error(errorMsg)));
      await groupController.deleteOne(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(
        ErrorCodes.InternalServerError,
      );
    });
  });
});
