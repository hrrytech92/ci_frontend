import { Reducer } from 'redux';
import { actionTypes } from '../actions/types';
import { IUserAction } from '../actions/userActions';
import { IOrgUser, IUser } from '../definitions/user';
import { IOrgUsersAction } from '../state/actions';

export const user: Reducer<IUser> = (state: IUser = { token: false }, action: IUserAction) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, ...action.user };
    case actionTypes.LOGOUT_USER:
      return { token: false };
    default:
      return state;
  }
};

export const users: Reducer<IOrgUser[]> = (state: IOrgUser[] = [], action: IOrgUsersAction) => {
  switch (action.type) {
    case actionTypes.SET_ORG_USERS:
      return action.users;
    default:
      return state;
  }
};
