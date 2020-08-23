import { UserInterface } from './user.interface';
import { mockUserData } from '../db/mock-data';

class UserService {
  getById(userId: string) {
    return mockUserData.find((user) => (user.id = userId));
  }

  suggest(loginSubstring: string, limit: number) {
    return mockUserData
      .filter((user) => user.login.includes(loginSubstring))
      .sort((a, b) => a.login.localeCompare(b.login))
      .slice(0, limit);
  }

  create(userDTO: UserInterface) {}

  update(userDTO: Partial<UserInterface>) {}
}

export const userService = new UserService();
