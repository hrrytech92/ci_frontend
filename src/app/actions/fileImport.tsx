import { IPaginated } from 'app/definitions/api';
import { IFileImport } from 'app/definitions/fileImport';
import axios from 'app/helpers/axios';
import Actions from './actions';
import { getOrgApiUrl } from './url';

export const getFileImports = (url?: string) => (dispatch): Promise<IPaginated<IFileImport[]>> => {
  const fetchUrl = url || getOrgApiUrl(`file_imports`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
