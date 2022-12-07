import { Reducer } from 'redux';
import { actionTypes } from '../actions/types';
import { IViewLoadingAction } from '../actions/viewActions';
import { IView } from '../definitions/view';

export const view: Reducer<IView> = (
  state: IView = { loading: false, block: false },
  action: IViewLoadingAction,
) => {
  switch (action.type) {
    case actionTypes.SET_VIEW_LOADING:
      return { ...state, loading: action.loading };
    case actionTypes.SET_BLOCK_VIEW_LOADING:
      return { ...state, block: action.block };
    default:
      return state;
  }
};
