import { fetchOrgs } from 'app/state/organizations/api';
import { Action } from 'redux';
import config from '../config';
import { IUser, IUserRequest, IUserResponse } from '../definitions/user';
import axios from '../helpers/axios';
import Actions from './actions';
import { actionTypes } from './types';

export interface IUserAction extends Action {
  user: IUser;
}

export const setUser: (user: IUser) => IUserAction = (user: IUser) => ({
  type: actionTypes.SET_USER,
  user,
});

export const loginUser = (user: IUserRequest) => (dispatch): Promise<IUserResponse> => {
  return axios
    .post(`/auth/login/`, user)
    .then(json => {
      const token = json.data.token;
      localStorage.setItem(config.TOKEN_STORE_NAME, token);
      dispatch(setUser({ token }));
      dispatch(fetchOrgs({ limit: 200 }));
      return token;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const setNoUser: () => Action = () => ({
  type: actionTypes.LOGOUT_USER,
});

export const logoutUser = () => (dispatch): void => {
  localStorage.removeItem(config.TOKEN_STORE_NAME);
  dispatch(Actions.setNoUser());
  window.location.reload();
};
