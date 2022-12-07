import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { values } from 'lodash';

export const getDomains = state => state.domains.byId;

export const getDomainsMeta = (state: IRedux) => state.domains.meta;

export const getFirstDomain = state => {
  return values(getDomains(state))[0];
};

export const getDomain = (state: IRedux, id: number) => {
  return getDomains(state)[id];
};

export const getDomainsForCurrentOrg = state => {
  const currentOrg = getActiveOrganization(state);

  return values(getDomains(state))
    .reverse()
    .filter(domain => {
      return domain.org === currentOrg.id;
    });
};

export const getDomainOptions = (state: IRedux) => {
  return getDomainsForCurrentOrg(state)
    .filter(d => !d.disabled)
    .map(domain => {
      return { key: domain.id, text: domain.name, value: domain.id };
    });
};
