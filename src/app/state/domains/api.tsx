import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IDomain } from 'app/definitions/domain';
import axios from 'app/helpers/axios';
import { fetchDomainsSuccess, fetchDomainSuccess } from 'app/state/domains/actions';

export const fetchDomains = (url?: string) => (dispatch): Promise<IDomain[]> => {
  const fetchUrl = url || `${getOrgApiUrl('domains')}?include_disabled=true`;
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchDomainsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchDomain = (id: number) => (dispatch): Promise<IDomain> => {
  return axios
    .get(getOrgApiUrl('domains/' + id))
    .then(({ data }) => {
      dispatch(fetchDomainSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const verifyDomain = (id: number, payload) => (dispatch): Promise<IDomain> => {
  return axios
    .put(getOrgApiUrl('domains/' + id + '/verify'), payload)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addDomain = (domain: IDomain) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('domains'), domain)
    .then(({ data }) => {
      dispatch(fetchDomains(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const editDomain = (domainId: number, domain: IDomain) => (dispatch): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`domains/${domainId}`), domain)
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Domain updated!'));
      dispatch(fetchDomains(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteDomain = (domainId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`domains/${domainId}`))
    .then(({ data }) => {
      dispatch(fetchDomains(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
