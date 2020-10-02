import { UserDto, UserInterface } from './user.interface';
import { UserModel } from '../../db/models';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { logMethodInfo } from '../../utils/decorators';
import { winstonLogger } from '../../utils/loggers';

class UserService {
  @logMethodInfo(winstonLogger)
  async getById(userId: string) {
    return await UserModel.findByPk(userId);
  }

  @logMethodInfo(winstonLogger)
  async suggest(loginSubstring: string, limit: number) {
    const suggestions = await UserModel.findAll({
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
      },
      limit,
    });

    return suggestions.sort((a, b) => a.login.localeCompare(b.login));
  }

  @logMethodInfo(winstonLogger)
  async create(userData: UserDto): Promise<UserModel> {
    const { login, password, age } = userData;

    const newUser = new UserModel();
    newUser.id = uuidv4();
    newUser.login = login;
    newUser.password = password;
    newUser.age = age;

    await newUser.save();

    return newUser;
  }

  @logMethodInfo(winstonLogger)
  async update(userDto: Partial<UserInterface>, userId: string) {
    const { login, password, age, isDeleted } = userDto;
    const userToUpdate = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (userToUpdate) {
      if (login) userToUpdate.login = login;
      if (password) userToUpdate.password = password;
      if (age) userToUpdate.age = age;
      if (isDeleted === true || isDeleted === false) {
        userToUpdate.is_deleted = isDeleted;
      }

      await userToUpdate.save();

      return userToUpdate;
    } else {
      return null;
    }
  }

  @logMethodInfo(winstonLogger)
  async softDelete(userId: string) {
    const userToSoftDelete = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (userToSoftDelete) {
      userToSoftDelete.is_deleted = true;

      await userToSoftDelete.save();

      return userToSoftDelete;
    } else {
      return null;
    }
  }
}

export const userService = new UserService();
