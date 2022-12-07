import { actionTypes } from 'app/actions/types';
import { Action, ActionCreator } from 'redux';

export const FETCH_SEGMENTS_SUCCESS = 'FETCH_SEGMENTS_SUCCESS';
export const FETCH_SEGMENT_SUCCESS = 'FETCH_SEGMENT_SUCCESS';
export const DELETE_SEGMENT_SUCCESS = 'DELETE_SEGMENT_SUCCESS';
export const FETCH_LIST_SEGMENT_MEMBERS_SUCCESS = 'FETCH_LIST_SEGMENT_MEMBERS_SUCCESS';

export const fetchSegmentsSuccess = payload => ({
  type: FETCH_SEGMENTS_SUCCESS,
  payload,
});

export const fetchSegmentSuccess = payload => ({
  type: FETCH_SEGMENT_SUCCESS,
  payload,
});

export const fetchListSegmentMembersSuccess = payload => ({
  type: FETCH_LIST_SEGMENT_MEMBERS_SUCCESS,
  payload,
});

export const deleteSegmentSuccess = payload => ({
  type: DELETE_SEGMENT_SUCCESS,
  payload,
});

export interface ISetSegmentMetaAction extends Action {
  fields: any;
  fieldMeta: any;
  type: typeof actionTypes.SET_SEGMENT_FILTERS;
}

export const setSegmentMeta: ActionCreator<ISetSegmentMetaAction> = (
  fields: any,
  fieldMeta: any,
) => ({
  fields,
  fieldMeta,
  type: actionTypes.SET_SEGMENT_FILTERS,
});
