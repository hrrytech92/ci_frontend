import { IRedux } from 'app/definitions/redux';
import { IOrgUser } from 'app/definitions/user';

export const getUsers = (state: IRedux): IOrgUser[] => state.users;
