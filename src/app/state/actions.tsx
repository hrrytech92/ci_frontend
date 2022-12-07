import { actionTypes } from 'app/actions/types';
import { IOrgUser } from 'app/definitions/user';
import { Action, ActionCreator } from 'redux';

export interface IOrgUsersAction extends Action {
  users: IOrgUser[];
}

export const setOrgUsers: ActionCreator<IOrgUsersAction> = (users: IOrgUser[]) => ({
  type: actionTypes.SET_ORG_USERS,
  users,
});
