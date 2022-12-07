import { NormalizedResults } from 'app/definitions/api';
import { IMessage } from 'app/definitions/message';
import {
  DELETE_CAMPAIGN_MESSAGES_SUCCESS,
  FETCH_CAMPAIGN_MESSAGES_SUCCESS,
  FETCH_CAMPAIGN_MESSAGE_SUCCESS,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGE_SUCCESS,
} from 'app/state/messages/actions';
import { Reducer, combineReducers } from 'redux';
import { omit } from 'lodash';
import { normalize, schema } from 'normalizr';

const messagesSchema = new schema.Entity('messages');

type MessageAction = {
  payload: any;
  type: string;
};

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const campaignMessagesByID: Reducer<NormalizedResults<IMessage>, MessageAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case DELETE_CAMPAIGN_MESSAGES_SUCCESS:
      return omit(state, action.payload);
    case FETCH_CAMPAIGN_MESSAGE_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, messagesSchema).entities.messages,
      };
    case FETCH_CAMPAIGN_MESSAGES_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [messagesSchema]).entities.messages,
      };
    default:
      return state;
  }
};

const campaignMessagesMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGN_MESSAGES_SUCCESS:
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

export const campaignMessages = combineReducers({
  byId: campaignMessagesByID,
  meta: campaignMessagesMeta,
});

const messagesByID: Reducer<NormalizedResults<IMessage>, MessageAction> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_MESSAGE_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, messagesSchema).entities.messages,
      };
    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [messagesSchema]).entities.messages,
      };
    default:
      return state;
  }
};

const messagesMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_MESSAGES_SUCCESS:
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

export const messages = combineReducers({
  byId: messagesByID,
  meta: messagesMeta,
});
