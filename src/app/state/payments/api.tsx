import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IBulkDonationImport } from 'app/definitions/payments';

import axios from 'app/helpers/axios';
import axios2 from 'axios';
import {
  fetchBulkDonationImportsSuccess,
  fetchBulkDonationImportSuccess,
} from 'app/state/payments/actions';

export const fetchBulkDonationImports = (url?: string) => (
  dispatch,
): Promise<IBulkDonationImport[]> => {
  const fetchUrl = url || getOrgApiUrl(`events/payments/bulk_donation_import`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchBulkDonationImportsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchBulkDonationImport = bulkDonationImportId => (
  dispatch,
): Promise<IBulkDonationImport> => {
  const fetchUrl = getOrgApiUrl(`events/payments/bulk_donation_import/${bulkDonationImportId}`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchBulkDonationImportSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const getFileSignedUrl = (payload: any) => (dispatch): Promise<IBulkDonationImport> => {
  return axios
    .post(getOrgApiUrl(`events/payments/bulk_donation_import`), payload)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const triggerFileUpload = (importId: string, payload: any) => (dispatch): Promise<any> => {
  return axios
    .patch(getOrgApiUrl(`events/payments/bulk_donation_import/${importId}`), payload)
    .then(({ data }) => {
      dispatch(fetchBulkDonationImportSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const uploadFileToSignedUrl = (url: any, file: any) => (dispatch): Promise<any> => {
  axios2.defaults.headers.common = {};
  return axios2
    .put(url, file, {
      headers: {
        'Content-Type': '',
      },
    })
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
