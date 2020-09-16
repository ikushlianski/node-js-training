import { v4 as uuidv4 } from 'uuid';

import { GroupModel, UserModel } from '../../db/models';
import { GroupDto } from './group.interface';

class GroupService {
  async getById(groupId: string) {
    return await GroupModel.findByPk(groupId);
  }

  async getAll(limit: number) {
    return await UserModel.findAll({
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

  // async update(userDto: Partial<UserInterface>, userId: string) {
  //   const { login, password, age, isDeleted } = userDto;
  //   const userToUpdate = await UserModel.findOne({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //
  //   if (userToUpdate) {
  //     if (login) userToUpdate.login = login;
  //     if (password) userToUpdate.password = password;
  //     if (age) userToUpdate.age = age;
  //     if (isDeleted === true || isDeleted === false) {
  //       userToUpdate.is_deleted = isDeleted;
  //     }
  //
  //     await userToUpdate.save();
  //
  //     return userToUpdate;
  //   } else {
  //     return null;
  //   }
  // }
  //
  // async deleteOne(userId: string) {
  //   const userToSoftDelete = await UserModel.findOne({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //
  //   if (userToSoftDelete) {
  //     userToSoftDelete.is_deleted = true;
  //
  //     await userToSoftDelete.save();
  //
  //     return userToSoftDelete;
  //   } else {
  //     return null;
  //   }
  // }
}

export const groupService = new GroupService();
