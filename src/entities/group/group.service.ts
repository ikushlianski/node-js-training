import { GroupModel, UserGroupModel } from '../../db/models';
import { GroupDto, GroupInterface } from './group.interface';
import { sequelizeConnection } from '../../db';
import { logMethodInfo, winstonLogger } from '../../utils';

class GroupService {
  @logMethodInfo(winstonLogger)
  async getById(groupId: string) {
    return await GroupModel.findByPk(groupId);
  }

  @logMethodInfo(winstonLogger)
  async getAll(limit: number) {
    return await GroupModel.findAll({
      limit,
    });
  }

  @logMethodInfo(winstonLogger)
  async create(groupData: GroupDto): Promise<GroupModel> {
    const { name, permissions } = groupData;

    const newGroup = new GroupModel();
    newGroup.name = name;
    newGroup.permissions = permissions;

    await newGroup.save();

    return newGroup;
  }

  @logMethodInfo(winstonLogger)
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

  @logMethodInfo(winstonLogger)
  async delete(groupId: string) {
    return await GroupModel.destroy({
      where: {
        id: groupId,
      },
    });
  }

  @logMethodInfo(winstonLogger)
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
