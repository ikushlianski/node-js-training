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

    const newUser = { id: uuid, login, password, age, isDeleted: false };

    mockUserData.push(newUser);

    return newUser;
  }

  update(userDTO: Partial<UserInterface>) {}
}

export const userService = new UserService();
