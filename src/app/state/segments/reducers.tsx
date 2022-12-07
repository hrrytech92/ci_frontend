import { actionTypes } from 'app/actions/types';
import { NormalizedResults } from 'app/definitions/api';
import { ISegment, ISegmentMetaRedux } from 'app/definitions/segment';
import { ISubscriber } from 'app/definitions/subscriber';
import {
  DELETE_SEGMENT_SUCCESS,
  FETCH_LIST_SEGMENT_MEMBERS_SUCCESS,
  FETCH_SEGMENT_SUCCESS,
  FETCH_SEGMENTS_SUCCESS,
  ISetSegmentMetaAction,
} from 'app/state/segments/actions';

import { normalize, schema } from 'normalizr';
import { Reducer, combineReducers } from 'redux';
import { omit } from 'lodash';

const segmentsSchema = new schema.Entity('segments');
const segmentMembersSchema = new schema.Entity('segmentMembers');

const initialState = {
  fields: {} as any,
  fieldMeta: {} as any,
};
const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

export const segmentMeta: Reducer<ISegmentMetaRedux> = (
  state = initialState,
  action: ISetSegmentMetaAction,
) => {
  switch (action.type) {
    case actionTypes.SET_SEGMENT_FILTERS:
      return {
        fields: action.fields,
        fieldMeta: action.fieldMeta,
      };
    default:
      return state;
  }
};
const segmentsByID: Reducer<NormalizedResults<ISegment>> = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SEGMENT_SUCCESS:
      return omit(state, action.payload);
    case FETCH_SEGMENT_SUCCESS:
      const normalizedSegment = normalize(action.payload, segmentsSchema);
      return {
        ...state,
        ...normalizedSegment.entities.segments,
      };
    case FETCH_SEGMENTS_SUCCESS:
      const normalizedSegments = normalize(action.payload.results, [segmentsSchema]);
      return {
        ...state,
        ...normalizedSegments.entities.segments,
      };
    default:
      return state;
  }
};

const segmentsPaginationMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_SEGMENTS_SUCCESS:
      const { count, next, previous } = action.payload;

      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

const segmentMembersByID: Reducer<NormalizedResults<ISubscriber>> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LIST_SEGMENT_MEMBERS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [segmentMembersSchema]).entities.segmentMembers,
      };
    default:
      return state;
  }
};

const segmentMembersMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_LIST_SEGMENT_MEMBERS_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

export const segments = combineReducers({
  byId: segmentsByID,
  meta: segmentsPaginationMeta,
});

export const segmentMembers = combineReducers({
  byId: segmentMembersByID,
  meta: segmentMembersMeta,
});
