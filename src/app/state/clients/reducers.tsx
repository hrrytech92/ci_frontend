import { NormalizedResults } from 'app/definitions/api';
import { IClient } from 'app/definitions/client';
import {
  DISABLE_CLIENT_SUCCESS,
  ENABLE_CLIENT_SUCCESS,
  FETCH_CLIENT_SUCCESS,
  FETCH_CLIENTS_SUCCESS,
  ClientDetailAction,
  ClientsAction,
  ClientAction,
} from 'app/state/clients/actions';
import { omit } from 'lodash';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IAction = ClientsAction | ClientDetailAction | ClientAction;

const clientsSchema = new schema.Entity('clients');

const clientsByID: Reducer<NormalizedResults<IClient>, IAction> = (state = {}, action) => {
  switch (action.type) {
    case ENABLE_CLIENT_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: false,
        },
      };
    case DISABLE_CLIENT_SUCCESS:
      return omit(state, action.payload);
    case FETCH_CLIENT_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, clientsSchema).entities.clients,
      };
    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [clientsSchema]).entities.clients,
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
const clientsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_CLIENTS_SUCCESS:
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

export const clients = combineReducers({
  byId: clientsByID,
  meta: clientsMeta,
});
