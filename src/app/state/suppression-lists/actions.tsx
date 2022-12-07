import { IPaginated } from 'app/definitions/api';
import { Action, ActionCreator } from 'redux';
import { ISuppressionList, ISuppressionListImport } from 'app/definitions/suppressionList';

export const FETCH_SUPPRESSION_LISTS_SUCCESS = 'FETCH_SUPPRESSION_LISTS_SUCCESS';
export const DELETE_SUPPRESSION_LIST_SUCCESS = 'DELETE_SUPPRESSION_LIST_SUCCESS';
export const FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS = 'FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS';
export const FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS = 'FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS';
export const FETCH_SUPPRESSION_LIST_SUCCESS = 'FETCH_SUPPRESSION_LIST_SUCCESS';
export const FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS = 'FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS';
export const SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS = 'SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS';
export const FETCH_SUPPRESSION_LIST_MEMBER_SUCCESS = 'FETCH_SUPPRESSION_LIST_MEMBER_SUCCESS';
export const DELETE_SUPPRESSION_LIST_MEMBER_SUCCESS = 'DELETE_SUPPRESSION_LIST_MEMBER_SUCCESS';
export const ADD_SUPPRESSION_LIST_MEMBER_SUCCESS = 'ADD_SUPPRESSION_LIST_MEMBER_SUCCESS';

export interface SuppressionListsAction extends Action<typeof FETCH_SUPPRESSION_LISTS_SUCCESS> {
  payload: IPaginated<ISuppressionList>;
}

export interface SuppressionListAction
  extends Action<typeof FETCH_SUPPRESSION_LIST_SUCCESS | typeof DELETE_SUPPRESSION_LIST_SUCCESS> {
  payload: ISuppressionList;
}

export interface SuppressionListImportsAction
  extends Action<typeof FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS> {
  payload: IPaginated<ISuppressionListImport>;
}

export interface SuppressionListImportAction
  extends Action<typeof FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS> {
  payload: ISuppressionListImport;
}

export const fetchSuppressionListsSuccess = (
  payload: IPaginated<ISuppressionList>,
): SuppressionListsAction => ({
  payload,
  type: FETCH_SUPPRESSION_LISTS_SUCCESS,
});

export const fetchSuppressionListImportsSuccess = (
  payload: IPaginated<ISuppressionListImport>,
): SuppressionListImportsAction => ({
  payload,
  type: FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS,
});

export const fetchSuppressionListImportSuccess = (
  payload: ISuppressionListImport,
): SuppressionListImportAction => ({
  payload,
  type: FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS,
});

export const fetchSuppressionListSuccess = (payload: ISuppressionList): SuppressionListAction => ({
  payload,
  type: FETCH_SUPPRESSION_LIST_SUCCESS,
});

export const deleteSuppressionListSuccess = payload => {
  return {
    payload,
    type: DELETE_SUPPRESSION_LIST_SUCCESS,
  };
};

export type SuppressionListMembersAction = {
  payload: any;
  type: string;
};

export const fetchSuppressionListMembersSuccess: ActionCreator<
  SuppressionListMembersAction
> = payload => ({
  payload,
  type: FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS,
});

export const fetchSuppressionListMemberSuccess: ActionCreator<any> = payload => ({
  payload,
  type: FETCH_SUPPRESSION_LIST_MEMBER_SUCCESS,
});

export const searchSuppressionListMembersSuccess: ActionCreator<
  SuppressionListMembersAction
> = payload => ({
  payload,
  type: SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS,
});

export const addSuppressionListMemberSuccess: ActionCreator<any> = payload => ({
  payload,
  type: ADD_SUPPRESSION_LIST_MEMBER_SUCCESS,
});

export const deleteSuppressionListMemberSuccess = payload => {
  return {
    type: DELETE_SUPPRESSION_LIST_MEMBER_SUCCESS,
    payload,
  };
};
