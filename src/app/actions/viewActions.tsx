import { Dispatch } from 'react-redux';
import { Action } from 'redux';
import { actionTypes } from './types';

export interface IViewLoadingAction extends Action {
  loading?: boolean;
  block?: boolean;
}

let timeout: any = false;

export const setLoading: (loading: boolean) => IViewLoadingAction = (loading: boolean) => ({
  loading,
  type: actionTypes.SET_VIEW_LOADING,
});

export const setViewLoading = (loading: boolean) => (dispatch: Dispatch<boolean>): void => {
  if (loading) {
    if (timeout) {
      clearTimeout(timeout);
    }
    dispatch(setLoading(loading));
  } else {
    timeout = setTimeout(() => {
      dispatch(setLoading(loading));
    }, 100);
  }
};

export const setNoLoading: (block: boolean) => IViewLoadingAction = (block: boolean) => ({
  block,
  type: actionTypes.SET_BLOCK_VIEW_LOADING,
});

export const noLoading = (delay: number = 300) => (dispatch: Dispatch<boolean>): void => {
  dispatch(setNoLoading(true));
  setTimeout(() => {
    dispatch(setNoLoading(false));
  }, delay);
};
