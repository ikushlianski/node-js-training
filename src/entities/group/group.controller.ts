import { Request, Response } from 'express';
import url from 'url';
import { ErrorCodes } from '../../errors';
import { SuccessResponses } from '../../constants';
import * as querystring from 'querystring';
import { groupService } from './group.service';
import { winstonLogger } from '../../utils/loggers';
import { LogLevels } from '../../utils';

const DEFAULT_LIST_LENGTH = 10;

class GroupController {
  async getGroups(req: Request, res: Response): Promise<Response> {
    const { query } = url.parse(req.url);
    let limit;

    if (query) {
      ({ limit } = querystring.parse(query));
    }

    const parsedLimit = isNaN(Number(limit))
      ? DEFAULT_LIST_LENGTH
      : Number(limit);

    try {
      const groups = await groupService.getAll(parsedLimit);

      if (!groups) {
        return res.send([]);
      }

      return res.send(groups);
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.sendStatus(ErrorCodes.InternalServerError);
    }
  }

  async getGroupById(req: Request, res: Response): Promise<Response> {
    const { groupId } = req.params;

    if (!groupId) {
      return res
        .status(ErrorCodes.BadRequest)
        .send('Group id is not present in the request');
    }

    try {
      const group = await groupService.getById(groupId);

      if (!group) {
        return res.send([]);
      }

      return res.send(group);
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.sendStatus(ErrorCodes.InternalServerError);
    }
  }

  async createGroup(req: Request, res: Response): Promise<Response> {
    const groupData = req.body;

    try {
      const createdGroup = await groupService.create(groupData);

      return res.status(SuccessResponses.Created).send(createdGroup);
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.status(ErrorCodes.BadRequest).send(e.message);
    }
  }

  async updateGroup(req: Request, res: Response): Promise<Response> {
    const { groupId } = req.params;
    const fieldsToUpdate = req.body;

    try {
      const updatedGroup = await groupService.update(fieldsToUpdate, groupId);

      if (!updatedGroup) {
        return res.status(ErrorCodes.NotFound).send('Group does not exist');
      }

      return res.send(updatedGroup);
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.sendStatus(ErrorCodes.InternalServerError);
    }
  }

  async deleteOne(req: Request, res: Response): Promise<Response> {
    const { groupId } = req.params;

    try {
      const deletedGroup = await groupService.delete(groupId);

      if (!deletedGroup) {
        return res.status(ErrorCodes.NotFound).send('Group does not exist');
      }

      return res.send(`Deleted group ${groupId}`);
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.sendStatus(ErrorCodes.InternalServerError);
    }
  }

  async addUsersToGroup(req: Request, res: Response): Promise<Response> {
    const { groupId, userIds } = req.body;

    try {
      await groupService.addUsersToGroup(groupId, userIds);

      return res.send('Users added');
    } catch (e) {
      winstonLogger(e.message, LogLevels.error);

      return res.sendStatus(ErrorCodes.InternalServerError);
    }
  }
}

export const groupController = new GroupController();
