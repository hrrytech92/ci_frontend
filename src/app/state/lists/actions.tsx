import { IPaginated } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { Action, ActionCreator } from 'redux';

export const FETCH_LISTS_SUCCESS = 'FETCH_LISTS_SUCCESS';
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS';
export const DISABLE_LIST_SUCCESS = 'DISABLE_LIST_SUCCESS';
export const ENABLE_LIST_SUCCESS = 'ENABLE_LIST_SUCCESS';

export interface ListsAction extends Action<typeof FETCH_LISTS_SUCCESS> {
  payload: IPaginated<IList>;
}
export interface ListAction extends Action<typeof FETCH_LIST_SUCCESS> {
  payload: IList;
}
type DetailAction = typeof DISABLE_LIST_SUCCESS | typeof ENABLE_LIST_SUCCESS;
export interface ListDetailAction extends Action<DetailAction> {
  payload: number;
}

export const fetchListsSuccess: ActionCreator<ListsAction> = payload => ({
  payload,
  type: FETCH_LISTS_SUCCESS,
});

export const fetchListSuccess = (payload: IList): ListAction => ({
  payload,
  type: FETCH_LIST_SUCCESS,
});

export const disableListSuccess = (payload: number): ListDetailAction => ({
  payload,
  type: DISABLE_LIST_SUCCESS,
});

export const enableListSuccess = payload => ({
  payload,
  type: ENABLE_LIST_SUCCESS,
});
