import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IOrgUser } from 'app/definitions/user';
import axios from 'app/helpers/axios';
import { setOrgUsers } from 'app/state/actions';

export const getOrgUsers = params => (dispatch): Promise<IOrgUser[]> => {
  return axios
    .get(getOrgApiUrl(`users`) + params)
    .then(({ data }) => {
      dispatch(setOrgUsers(data.results));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
