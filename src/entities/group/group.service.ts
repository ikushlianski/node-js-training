import { GroupModel, UserGroupModel } from '../../db/models';
import { GroupDto, GroupInterface } from './group.interface';
import { sequelizeConnection } from '../../db';

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

    await groupToUpdate?.update({
      name,
      permissions,
    });

    return groupToUpdate;
  }

  async delete(groupId: string) {
    return await GroupModel.destroy({
      where: {
        id: groupId,
      },
    });
  }

  async addUsersToGroup(groupId: string, userIds: string[]) {
    return await sequelizeConnection.transaction(async (t) => {
      const addedUsers = userIds.map((userId) => {
        return UserGroupModel.create({ groupId, userId }, { transaction: t });
      });

      await Promise.all(addedUsers);
    });
  }
}

export const groupService = new GroupService();
