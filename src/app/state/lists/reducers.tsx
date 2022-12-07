import { NormalizedResults } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IMember } from 'app/definitions/member';
import {
  DISABLE_LIST_SUCCESS,
  ENABLE_LIST_SUCCESS,
  FETCH_LIST_SUCCESS,
  FETCH_LISTS_SUCCESS,
  ListDetailAction,
  ListsAction,
  ListAction,
} from 'app/state/lists/actions';
import {
  FETCH_LIST_MEMBERS_SUCCESS,
  ListMembersAction,
  SEARCH_LIST_MEMBERS_SUCCESS,
} from 'app/state/subscribers/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IAction = ListsAction | ListDetailAction | ListAction;
type IListMembersAction = ListMembersAction;

const listsSchema = new schema.Entity('lists');
const listMembersSchema = new schema.Entity('listMembers');

const listsByID: Reducer<NormalizedResults<IList>, IAction> = (state = {}, action) => {
  switch (action.type) {
    case ENABLE_LIST_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: false,
        },
      };
    case DISABLE_LIST_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: true,
        },
      };
    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, listsSchema).entities.lists,
      };
    case FETCH_LISTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [listsSchema]).entities.lists,
      };
    default:
      return state;
  }
};

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};
const listsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_LISTS_SUCCESS:
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
const listMembersMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case SEARCH_LIST_MEMBERS_SUCCESS:
    case FETCH_LIST_MEMBERS_SUCCESS:
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
const listMembersByID: Reducer<NormalizedResults<IMember>, IListMembersAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case FETCH_LIST_MEMBERS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [listMembersSchema]).entities.listMembers,
      };
    case SEARCH_LIST_MEMBERS_SUCCESS:
      return normalize(action.payload.results, [listMembersSchema]).entities.listMembers;
    default:
      return state;
  }
};

export const lists = combineReducers({
  byId: listsByID,
  meta: listsMeta,
});

export const listMembers = combineReducers({
  byId: listMembersByID,
  meta: listMembersMeta,
});
