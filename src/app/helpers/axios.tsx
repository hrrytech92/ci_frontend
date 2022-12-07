import axios from 'axios';
import { isObject } from 'lodash';
import Actions from '../actions/actions';
import config from '../config';
import store from '../store';

export interface IHeaders {
  Authorization?: string;
}

axios.interceptors.response.use(null, err => {
  if (err) {
    if (err.response.status === 401) {
      store.dispatch(Actions.showError('You have been logged out'));
      store.dispatch<any>(Actions.logoutUser());
    } else {
      let message;

      // handle validation errors from API eg {response.data.variables: ""}
      if (isObject(err.response.data)) {
        message = Object.keys(err.response.data)
          .map(key => `${key}: ${err.response.data[key]}`)
          .join('; ');
      } else {
        message = err.response.data.message || err.response.data.error || 'An error has occured';
      }

      message = typeof message === 'string' ? message : 'An error has occured';
      store.dispatch(Actions.showError(message));
    }
  }
  return Promise.reject(err);
});

function getOptions() {
  const headers: IHeaders = {};
  const token = localStorage.getItem(config.TOKEN_STORE_NAME);
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  return { headers, baseURL: config.API_URL };
}

const client = () => {
  return {
    delete: (url, options = {}) => axios.delete(url, { ...getOptions(), ...options }),
    get: (url, options = {}) => axios.get(url, { ...getOptions(), ...options }),
    post: (url, data, options = {}) => axios.post(url, data, { ...getOptions(), ...options }),
    put: (url, data, options = {}) => axios.put(url, data, { ...getOptions(), ...options }),
    patch: (url, data, options = {}) => axios.patch(url, data, { ...getOptions(), ...options }),
  };
};

const request = client();

export default request;
