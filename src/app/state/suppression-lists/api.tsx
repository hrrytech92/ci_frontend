import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import {
  ISuppressionList,
  ISuppressedEmail,
  ISuppressionListImport,
} from 'app/definitions/suppressionList';
import axios from 'app/helpers/axios';
import axios2 from 'axios';
import {
  fetchSuppressionListSuccess,
  fetchSuppressionListsSuccess,
  fetchSuppressionListMembersSuccess,
  searchSuppressionListMembersSuccess,
  addSuppressionListMemberSuccess,
  deleteSuppressionListMemberSuccess,
  fetchSuppressionListImportsSuccess,
  fetchSuppressionListImportSuccess,
  deleteSuppressionListSuccess,
} from 'app/state/suppression-lists/actions';

export const fetchSuppressionLists = (url?: string) => (dispatch): Promise<ISuppressionList[]> => {
  const fetchUrl = url || getOrgApiUrl(`suppression_list/suppression_list`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSuppressionListsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSuppressionList = suppressionListId => (dispatch): Promise<ISuppressionList> => {
  return axios
    .get(getOrgApiUrl(`suppression_list/suppression_list/${suppressionListId}`))
    .then(({ data }) => {
      dispatch(fetchSuppressionListSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteSuppressionList = suppressionListId => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`suppression_list/suppression_list/${suppressionListId}`))
    .then(({ data }) => {
      dispatch(deleteSuppressionListSuccess(suppressionListId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSuppressionListImports = (url?: string) => (
  dispatch,
): Promise<ISuppressionListImport[]> => {
  const fetchUrl = url || getOrgApiUrl(`suppression_list/suppression_list_import`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSuppressionListImportsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSuppressionListImport = suppressionListImportId => (
  dispatch,
): Promise<ISuppressionListImport> => {
  const fetchUrl = getOrgApiUrl(
    `suppression_list/suppression_list_import/${suppressionListImportId}`,
  );
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSuppressionListImportSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSuppressionListMembers = (suppressionListId?: number, url?: string) => (
  dispatch,
): Promise<void> => {
  const fetchUrl =
    url || getOrgApiUrl(`suppression_list/suppression_list/${suppressionListId}/members`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSuppressionListMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addSuppressionListMember = (suppressionListId: any, email: string) => (
  dispatch,
): Promise<void> => {
  const url = getOrgApiUrl(`suppression_list/suppression_list/${suppressionListId}/members`);
  return axios
    .post(url, { email })
    .then(({ data }) => {
      dispatch(addSuppressionListMemberSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteSuppressionListMember = (
  suppressionListId: any,
  suppressionListMemberId: string,
) => (dispatch): Promise<void> => {
  const url = getOrgApiUrl(
    `suppression_list/suppression_list/${suppressionListId}/members/${suppressionListMemberId}`,
  );
  return axios
    .delete(url)
    .then(({ data }) => {
      dispatch(deleteSuppressionListMemberSuccess(suppressionListMemberId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveSuppressionList = (suppressionList: ISuppressionList) => (
  dispatch,
): Promise<void> => {
  let request;
  if (suppressionList.id) {
    request = axios.put(
      getOrgApiUrl(`suppression_list/suppression_list/${suppressionList.id}`),
      suppressionList,
    );
  } else {
    request = axios.post(getOrgApiUrl('suppression_list/suppression_list'), suppressionList);
  }
  return request
    .then(({ data }) => {
      dispatch(fetchSuppressionListSuccess(data));
      dispatch(Actions.showSuccess('Suppression List Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const searchSuppressionListMembers = (suppressionListId: number, search: string) => (
  dispatch,
): Promise<ISuppressedEmail[]> => {
  return axios
    .get(getOrgApiUrl(`suppression_list/suppression_list/${suppressionListId}/members`), {
      params: { email: search },
    })
    .then(({ data }) => {
      dispatch(searchSuppressionListMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const getFileSignedUrl = (payload: any) => (dispatch): Promise<ISuppressionListImport> => {
  return axios
    .post(getOrgApiUrl(`suppression_list/suppression_list_import`), payload)
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
    .patch(getOrgApiUrl(`suppression_list/suppression_list_import/${importId}`), payload)
    .then(({ data }) => {
      dispatch(fetchSuppressionListImportSuccess(data));
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
