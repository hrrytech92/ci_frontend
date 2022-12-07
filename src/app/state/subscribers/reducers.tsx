import { NormalizedResults } from 'app/definitions/api';
import { ISubscriber } from 'app/definitions/subscriber';
import {
  ADD_LIST_MEMBER_SUCCESS,
  FETCH_SUBSCRIBERS_SUCCESS,
  FETCH_SUBSCRIBER_SUCCESS,
  ListMembersAddAction,
  SubscriberAction,
  SEARCH_SUBSCRIBERS_SUCCESS,
  SubscribersAction,
} from 'app/state/subscribers/actions';
import update from 'immutability-helper';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IAction = SubscribersAction | ListMembersAddAction | SubscriberAction;

const subscribers = new schema.Entity('subscribers');

const subscribersById: Reducer<NormalizedResults<ISubscriber>, IAction> = (state = {}, action) => {
  switch (action.type) {
    case SEARCH_SUBSCRIBERS_SUCCESS:
      return normalize(action.payload.results, [subscribers]).entities.subscribers || {};
    case ADD_LIST_MEMBER_SUCCESS:
      const { subscriberId, list } = action.payload;

      const newSubscriptions = state[subscriberId].subscriptions.filter(sub => {
        return String(sub.list_id) !== String(list.id);
      });

      // @ts-ignore
      newSubscriptions.push({
        list_id: String(list.id),
        status: 'subscribed',
        ...action.payload.list,
      });

      return update(state, {
        [subscriberId]: {
          subscriptions: { $set: newSubscriptions },
        },
      });

    case FETCH_SUBSCRIBER_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, subscribers).entities.subscribers,
      };
    case FETCH_SUBSCRIBERS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [subscribers]).entities.subscribers,
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

const subscribersMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case SEARCH_SUBSCRIBERS_SUCCESS:
    case FETCH_SUBSCRIBERS_SUCCESS:
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

export default combineReducers({
  byId: subscribersById,
  meta: subscribersMeta,
});
