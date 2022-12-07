import Actions from 'app/actions/actions';
// import { getOrgApiUrl } from 'app/actions/url';
import { IClient } from 'app/definitions/client';
import axios from 'app/helpers/axios';
import {
  disableClientSuccess,
  enableClientSuccess,
  fetchClientsSuccess,
  fetchClientSuccess,
} from 'app/state/clients/actions';

export const fetchClients = (url?: string) => (dispatch): Promise<IClient[]> => {
  // const fetchUrl = url || `${getOrgApiUrl('clients')}?include_disabled=true`;
  const fetchUrl = url || `clients?include_disabled=true`;

  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchClientsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchClient = (clientId: string) => (dispatch): Promise<IClient> => {
  return (
    axios
      // .get(getOrgApiUrl(`clients/${clientId}/?include_disabled=true`))
      .get(`clients/${clientId}/?include_disabled=true`)
      .then(({ data }) => {
        dispatch(fetchClientSuccess(data));
        return data;
      })
      .catch(error => {
        dispatch(Actions.showError(error));
        return error;
      })
  );
};
export const editClient = (clientId: number, client: IClient) => (dispatch): Promise<void> => {
  return (
    axios
      // .patch(getOrgApiUrl(`clients/${clientId}`), client)
      .patch(`clients/${clientId}/`, client)
      .then(({ data }) => {
        dispatch(fetchClientSuccess(data));
        dispatch(Actions.showSuccess('Client Updated'));
        return data;
      })
      .catch(error => {
        dispatch(Actions.showError(error));
        return error;
      })
  );
};
export const deleteClient = (clientId: number) => (dispatch): Promise<void> => {
  return (
    axios
      // .delete(getOrgApiUrl(`clients/${clientId}`))
      .delete(`clients/${clientId}/`)
      .then(({ data }) => {
        dispatch(disableClientSuccess(clientId));
        // dispatch(fetchClients(''));
        return data;
      })
      .catch(error => {
        dispatch(Actions.showError(error));
        return error;
      })
  );
};
export const enableClient = (clientId: number) => (dispatch): Promise<void> => {
  return (
    axios
      // .put(getOrgApiUrl(`clients/${clientId}/enable`), {})
      .put(`clients/${clientId}/enable`, {})
      .then(({ data }) => {
        dispatch(enableClientSuccess(clientId));
        return data;
      })
      .catch(error => {
        dispatch(Actions.showError(error));
        return error;
      })
  );
};
export const createClient = (client: IClient) => (dispatch): Promise<void> => {
  return (
    axios
      // .post(getOrgApiUrl('clients'), client)
      .post('clients/', client)
      .then(({ data }) => {
        console.log('createClient: ', data);
        dispatch(fetchClientSuccess(data));
        dispatch(Actions.showSuccess('Client created'));
        return data;
      })
      .catch(error => {
        dispatch(Actions.showError(error));
        return error;
      })
  );
};
