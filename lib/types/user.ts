export interface UserInput {
  id: number;
  name: string;
  username: string;
}

export interface UserViewModel {
  id: string;
  name: string;
  username: string;
}

export type UserRaw = {
  id: number;
  name: string;
  username: string;
};
