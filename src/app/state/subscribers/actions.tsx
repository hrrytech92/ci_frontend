import { IPaginated } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IMember } from 'app/definitions/member';
import { ISubscriber } from 'app/definitions/subscriber';
import { Action, ActionCreator } from 'redux';

export const SEARCH_SUBSCRIBERS_SUCCESS = 'SEARCH_SUBSCRIBERS_SUCCESS';
export const FETCH_SUBSCRIBERS_SUCCESS = 'FETCH_SUBSCRIBERS_SUCCESS';
export const FETCH_SUBSCRIBER_SUCCESS = 'FETCH_SUBSCRIBER_SUCCESS';
export const FETCH_LIST_MEMBERS_SUCCESS = 'FETCH_LIST_MEMBERS_SUCCESS';
export const SEARCH_LIST_MEMBERS_SUCCESS = 'SEARCH_LIST_MEMBERS_SUCCESS';
export const ADD_LIST_MEMBER_SUCCESS = 'ADD_LIST_MEMBER_SUCCESS';

type SUBSCRIBER_ACTION_TYPES =
  | typeof FETCH_SUBSCRIBERS_SUCCESS
  | typeof SEARCH_SUBSCRIBERS_SUCCESS;

type SUBSCRIBER_DETAIL_ACTION = typeof FETCH_SUBSCRIBER_SUCCESS;

export interface ListMembersAddAction extends Action<typeof ADD_LIST_MEMBER_SUCCESS> {
  payload: {
    subscriberId: string;
    list: IList;
  };
}
export interface SubscribersAction extends Action<SUBSCRIBER_ACTION_TYPES> {
  payload: IPaginated<ISubscriber>;
}

export interface SubscriberAction extends Action<SUBSCRIBER_DETAIL_ACTION> {
  payload: ISubscriber;
}

export const fetchSubscribersSuccess = (payload: IPaginated<ISubscriber>): SubscribersAction => ({
  payload,
  type: FETCH_SUBSCRIBERS_SUCCESS,
});

export const fetchSubscriberSuccess = (payload: ISubscriber): SubscriberAction => ({
  payload,
  type: FETCH_SUBSCRIBER_SUCCESS,
});

export const searchSubscribersSuccess = (payload): SubscribersAction => ({
  payload,
  type: SEARCH_SUBSCRIBERS_SUCCESS,
});
type ListAction = typeof FETCH_LIST_MEMBERS_SUCCESS | typeof SEARCH_LIST_MEMBERS_SUCCESS;

export interface ListMembersAction extends Action<ListAction> {
  payload: IPaginated<IMember>;
}

export const fetchListMembersSuccess: ActionCreator<ListMembersAction> = payload => ({
  payload,
  type: FETCH_LIST_MEMBERS_SUCCESS,
});
export const searchListMembersSuccess: ActionCreator<ListMembersAction> = payload => ({
  payload,
  type: SEARCH_LIST_MEMBERS_SUCCESS,
});
export const addListMembersSuccess: ActionCreator<ListMembersAddAction> = payload => ({
  payload,
  type: ADD_LIST_MEMBER_SUCCESS,
});
