import { UserDto, UserInterface } from './user.interface';
import { mockUserData } from '../db/mock-data';
import { v4 as uuidv4 } from 'uuid';

class UserService {
  getById(userId: string) {
    return mockUserData.find((user) => user.id === userId);
  }

  suggest(loginSubstring: string, limit: number) {
    return mockUserData
      .filter((user) => user.login.includes(loginSubstring))
      .sort((a, b) => a.login.localeCompare(b.login))
      .slice(0, limit);
  }

  create(userData: UserDto): UserInterface | never {
    const { login, password, age } = userData;
    const uuid = uuidv4();

    if (!login || !password || !age) {
      throw Error('Please provide all required user params');
    }

    const newUser = { id: uuid, login, password, age };

    mockUserData.push(newUser);

    return newUser;
  }

  update(userDto: Partial<UserInterface>, userId: string) {
    const { login, password, age } = userDto;
    let updatedUser;

    mockUserData.forEach((user) => {
      if (user.id === userId) {
        if (login) user.login = login;
        if (password) user.password = password;
        if (age) user.age = age;

        updatedUser = user;
      }
    });

    return updatedUser;
  }

  softDelete(userId: string) {
    let deletedUser;

    mockUserData.forEach((user) => {
      if (user.id === userId) {
        user.isDeleted = true;

        deletedUser = user;
      }
    });

    console.log(mockUserData)

    return deletedUser;
  }
}

export const userService = new UserService();
