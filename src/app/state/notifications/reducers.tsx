import { Reducer } from 'redux';
import { NotificationAction } from 'app/state/notifications/actions';
import { actionTypes } from '../../actions/types';
import { INotification } from '../../definitions/messageBar';

export const notification: Reducer<INotification> = (
  state: INotification = {
    show: false,
    text: '',
    type: 'success',
  },
  action: NotificationAction,
) => {
  switch (action.type) {
    case actionTypes.SHOW_NOTIFICATION:
      return { ...state, text: action.text, type: action.messageType, show: true };
    case actionTypes.HIDE_NOTIFICATION:
      return { ...state, show: false };
    default:
      return state;
  }
};
