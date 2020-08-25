export interface UserInterface {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted?: boolean;
}

export type UserDto = Pick<UserInterface, 'login' | 'password' | 'age'>;
