import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IMember } from 'app/definitions/member';
import { ISubscriber } from 'app/definitions/subscriber';
import axios from 'app/helpers/axios';
import { getList } from 'app/state/lists/selectors';
import {
  addListMembersSuccess,
  fetchListMembersSuccess,
  fetchSubscribersSuccess,
  fetchSubscriberSuccess,
  searchListMembersSuccess,
  searchSubscribersSuccess,
} from 'app/state/subscribers/actions';

export const fetchSubscribers = (url?: string) => (dispatch): Promise<ISubscriber[]> => {
  const fetchUrl = url || getOrgApiUrl('subscribers');
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSubscribersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSubscriber = (subscriberId: string) => (dispatch): Promise<ISubscriber> => {
  return axios
    .get(getOrgApiUrl(`subscribers/${subscriberId}`))
    .then(({ data }) => {
      dispatch(fetchSubscriberSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const getSubscriberEvents = (subscriberId: number) => (dispatch): Promise<ISubscriber> => {
  return axios
    .get(getOrgApiUrl(`subscribers/${subscriberId}/events`))
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addSubscriber = (subscriber: ISubscriber) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('subscribers'), subscriber)
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Subscriber created'));
      dispatch(fetchSubscriberSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const editSubscriber = (subscriberId: string, subscriber: Partial<ISubscriber>) => (
  dispatch,
): Promise<void> => {
  dispatch(Actions.noLoading());
  return axios
    .put(getOrgApiUrl(`subscribers/${subscriberId}`), subscriber)
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Subscriber updated!'));
      dispatch(fetchSubscribers(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteSubscriber = (subscriberId: string) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`subscribers/${subscriberId}`))
    .then(({ data }) => {
      dispatch(fetchSubscribers(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const searchSubscribers = (search: string) => (dispatch): Promise<ISubscriber> => {
  return axios
    .get(getOrgApiUrl(`subscribers`), { params: { email: search } })
    .then(({ data }) => {
      dispatch(searchSubscribersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const updateListMember = (listId: number, subscriberId: string, payload: any) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`lists/${listId}/members/${subscriberId}/?include_disabled=true`), payload)
    .then(({ data }) => {
      dispatch(fetchSubscriberSuccess(data.subscriber));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addListMembers = (listId: number, subscriberId: string) => (
  dispatch,
  getState,
): Promise<void> => {
  return axios
    .post(getOrgApiUrl(`lists/${listId}/members/?include_disabled=true`), {
      subscriber_ids: [subscriberId],
    })
    .then(({ data }) => {
      const list = getList(getState(), listId);
      dispatch(addListMembersSuccess({ list, subscriberId }));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchListMembers = (listId?: number, url?: string) => (
  dispatch,
): Promise<IMember[]> => {
  const fetchUrl = url || getOrgApiUrl(`lists/${listId}/members/?include_disabled=true`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchListMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const searchListMembers = (listId: number, search: string) => (
  dispatch,
): Promise<IMember[]> => {
  return axios
    .get(getOrgApiUrl(`lists/${listId}/members`), { params: { email: search } })
    .then(({ data }) => {
      dispatch(searchListMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
