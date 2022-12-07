export interface IUserRequest {
  username: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  email: string;
  password: string;
}

export interface IUser {
  token: string | boolean;
}

export interface IOrgUser {
  id: number;
  url: string;
  email: string;
  name: string;
}
