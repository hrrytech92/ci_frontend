import { IRedux } from 'app/definitions/redux';
import { ISubscriber } from 'app/definitions/subscriber';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { values } from 'lodash';

export const getSubscribers = (state: IRedux) => state.subscribers.byId;
export const getSubscribersMeta = (state: IRedux) => state.subscribers.meta;
export const getSubscribersForCurrentOrg = state => {
  const currentOrg = getActiveOrganization(state);
  return values(getSubscribers(state))
    .reverse()
    .filter(sub => {
      return sub.org === currentOrg.id;
    });
};

export const getSubscriber = (state: IRedux, id: string): ISubscriber => {
  return getSubscribers(state)[id];
};
