export interface UserInterface {
  id: string;
  login: string;
  password: string;
  age: number;
  is_deleted?: boolean;
}

export type UserDto = Pick<UserInterface, 'login' | 'password' | 'age'>;
