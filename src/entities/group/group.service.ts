import { v4 as uuidv4 } from 'uuid';

import { GroupModel } from '../../db/models';
import { GroupDto, GroupInterface } from './group.interface';

class GroupService {
  async getById(groupId: string) {
    return await GroupModel.findByPk(groupId);
  }

  async getAll(limit: number) {
    return await GroupModel.findAll({
      limit,
    });
  }

  async create(groupData: GroupDto): Promise<GroupModel> {
    const { name, permissions } = groupData;

    const newGroup = new GroupModel();
    newGroup.id = uuidv4();
    newGroup.name = name;
    newGroup.permissions = permissions;

    await newGroup.save();

    return newGroup;
  }

  async update(groupDto: Partial<GroupInterface>, groupId: string) {
    const { name, permissions } = groupDto;
    const groupToUpdate = await GroupModel.findOne({
      where: {
        id: groupId,
      },
    });

    if (groupToUpdate) {
      if (name) groupToUpdate.name = name;
      if (permissions) groupToUpdate.permissions = permissions;

      await groupToUpdate.save();

      return groupToUpdate;
    } else {
      return null;
    }
  }

  async delete(groupId: string) {
    return await GroupModel.destroy({
      where: {
        id: groupId,
      },
    });
  }
}

export const groupService = new GroupService();
