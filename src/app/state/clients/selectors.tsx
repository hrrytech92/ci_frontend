import { IClient } from 'app/definitions/client';
import { IRedux } from 'app/definitions/redux';
import { getOrgUrl } from 'app/state/organizations/selectors';
import { values } from 'lodash';

export const getClient = (state: IRedux, clientId: string) => getClients(state)[clientId];

export const getClients = (state: IRedux) => state.clients.byId;

export const getClientsMeta = (state: IRedux) => state.clients.meta;

export const getClientsForCurrentOrg = (state: IRedux): IClient[] => {
  return values(getClients(state)).reverse();
};

export const getClientUrl = (state: IRedux, clientId: string) => {
  return `${getOrgUrl(state)}clients/${clientId}`;
};

export const getClientsUrl = (state: IRedux) => {
  return `${getOrgUrl(state)}clients`;
};
