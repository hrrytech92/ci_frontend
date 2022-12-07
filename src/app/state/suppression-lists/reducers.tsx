import { NormalizedResults } from 'app/definitions/api';
import {
  ISuppressionList,
  ISuppressedEmail,
  ISuppressionListImport,
} from 'app/definitions/suppressionList';
import {
  FETCH_SUPPRESSION_LISTS_SUCCESS,
  FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS,
  FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS,
  FETCH_SUPPRESSION_LIST_SUCCESS,
  DELETE_SUPPRESSION_LIST_SUCCESS,
  FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS,
  ADD_SUPPRESSION_LIST_MEMBER_SUCCESS,
  SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS,
  DELETE_SUPPRESSION_LIST_MEMBER_SUCCESS,
  SuppressionListMembersAction,
  SuppressionListImportsAction,
  SuppressionListImportAction,
} from 'app/state/suppression-lists/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';
import { omit } from 'lodash';

type IImportAction = SuppressionListImportsAction | SuppressionListImportAction;
type SuppressionListAction = {
  payload: any;
  type: string;
};

const suppressionListsSchema = new schema.Entity('suppressionLists');
const suppressionListImportsSchema = new schema.Entity('suppressionListImports');
const suppressionListMembersSchema = new schema.Entity('suppressionListMembers');

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const suppressionListsById: Reducer<NormalizedResults<ISuppressionList>, SuppressionListAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case DELETE_SUPPRESSION_LIST_SUCCESS:
      return omit(state, action.payload);
    case FETCH_SUPPRESSION_LIST_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, suppressionListsSchema).entities.suppressionLists,
      };
    case FETCH_SUPPRESSION_LISTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [suppressionListsSchema]).entities.suppressionLists,
      };
    default:
      return state;
  }
};

const suppressionListsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_SUPPRESSION_LISTS_SUCCESS:
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

export const suppressionLists = combineReducers({
  byId: suppressionListsById,
  meta: suppressionListsMeta,
});

const suppressionListMembersMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS:
    case FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS:
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

const suppressionListMembersByID: Reducer<
  NormalizedResults<ISuppressedEmail>,
  SuppressionListMembersAction
> = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SUPPRESSION_LIST_MEMBER_SUCCESS:
      return omit(state, action.payload);
    case ADD_SUPPRESSION_LIST_MEMBER_SUCCESS:
      const normalizedSuppressionListMember = normalize(
        action.payload,
        suppressionListMembersSchema,
      );
      return {
        ...state,
        ...normalizedSuppressionListMember.entities.suppressionListMembers,
      };
    case SEARCH_SUPPRESSION_LIST_MEMBERS_SUCCESS:
      return (
        normalize(action.payload.results, [suppressionListMembersSchema]).entities
          .suppressionListMembers || {}
      );
    case FETCH_SUPPRESSION_LIST_MEMBERS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [suppressionListMembersSchema]).entities
          .suppressionListMembers,
      };
    default:
      return state;
  }
};

export const suppressionListMembers = combineReducers({
  byId: suppressionListMembersByID,
  meta: suppressionListMembersMeta,
});

const suppressionListImportsById: Reducer<
  NormalizedResults<ISuppressionListImport>,
  IImportAction
> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SUPPRESSION_LIST_IMPORT_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, suppressionListImportsSchema).entities.suppressionListImports,
      };
    case FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [suppressionListImportsSchema]).entities
          .suppressionListImports,
      };
    default:
      return state;
  }
};

const suppressionListImportsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_SUPPRESSION_LIST_IMPORTS_SUCCESS:
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

export const suppressionListImports = combineReducers({
  byId: suppressionListImportsById,
  meta: suppressionListImportsMeta,
});
