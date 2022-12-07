import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IList } from 'app/definitions/list';
import axios from 'app/helpers/axios';
import {
  disableListSuccess,
  enableListSuccess,
  fetchListsSuccess,
  fetchListSuccess,
} from 'app/state/lists/actions';

export const fetchLists = (url?: string) => (dispatch): Promise<IList[]> => {
  const fetchUrl = url || `${getOrgApiUrl('lists')}?include_disabled=true`;

  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchListsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchList = (listId: number) => (dispatch): Promise<IList> => {
  return axios
    .get(getOrgApiUrl(`lists/${listId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(fetchListSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const editList = (listId: number, list: IList) => (dispatch): Promise<void> => {
  return axios
    .patch(getOrgApiUrl(`lists/${listId}`), list)
    .then(({ data }) => {
      dispatch(fetchListSuccess(data));
      dispatch(Actions.showSuccess('List Updated'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteList = (listId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`lists/${listId}`))
    .then(({ data }) => {
      dispatch(disableListSuccess(listId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const enableList = (listId: number) => (dispatch): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`lists/${listId}/enable`), {})
    .then(({ data }) => {
      dispatch(enableListSuccess(listId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const createList = (list: IList) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('lists'), list)
    .then(({ data }) => {
      dispatch(fetchListSuccess(data));
      dispatch(Actions.showSuccess('List created'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
