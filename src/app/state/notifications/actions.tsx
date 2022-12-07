import { actionTypes } from 'app/actions/types';
import { Action } from 'redux';

export interface NotificationAction extends Action {
  text: string;
  messageType: string;
}

export const showError: (error: string) => NotificationAction = (error: string) => ({
  messageType: 'danger',
  text: error.toString(),
  type: actionTypes.SHOW_NOTIFICATION,
});

export const showSuccess: (text: string) => NotificationAction = (text: string) => ({
  messageType: 'success',
  text,
  type: actionTypes.SHOW_NOTIFICATION,
});

export const hide = () => ({
  type: actionTypes.HIDE_NOTIFICATION,
});
