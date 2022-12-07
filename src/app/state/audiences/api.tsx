import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { ISubscriber } from 'app/definitions/subscriber';
import { IAudience, IAudienceImport } from 'app/definitions/audience';
import axios from 'app/helpers/axios';
import axios2 from 'axios';
import {
  fetchAudiencesSuccess,
  fetchAudienceSuccess,
  fetchAudienceMembersSuccess,
  fetchAudienceImportSuccess,
  fetchAudienceImportsSuccess,
  resetAudience,
  deleteAudienceSuccess,
} from 'app/state/audiences/actions';

export const fetchAudiences = (listId?: number, url?: string) => (
  dispatch,
): Promise<IAudience[]> => {
  const fetchUrl = url || getOrgApiUrl(`lists/${listId}/audiences`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchAudiencesSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchAudience = (listId: number, audienceId: number) => (
  dispatch,
): Promise<IAudience> => {
  return axios
    .get(getOrgApiUrl(`lists/${listId}/audiences/${audienceId}`))
    .then(({ data }) => {
      dispatch(fetchAudienceSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addAudience = (listId: number, audience: IAudience) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl(`lists/${listId}/audiences`), audience)
    .then(({ data }) => {
      dispatch(fetchAudienceSuccess(data));
      dispatch(Actions.showSuccess('Audience Created!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return Promise.reject(error);
    });
};

export const deleteAudience = (listId: number, audienceId: number) => (
  dispatch,
): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`lists/${listId}/audiences/${audienceId}`))
    .then(({ data }) => {
      dispatch(deleteAudienceSuccess(audienceId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const editAudience = (listId: number, audienceId: number, audience: IAudience) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`lists/${listId}/audiences/${audienceId}`), audience)
    .then(({ data }) => {
      dispatch(fetchAudienceSuccess(data));
      dispatch(Actions.showSuccess('Audience Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchAudienceMembers = (listId?: number, audienceId?: number, url?: string) => (
  dispatch,
): Promise<ISubscriber[]> => {
  const fetchUrl = url || getOrgApiUrl(`lists/${listId}/audiences/${audienceId}/members`);
  if (!url) {
    dispatch(resetAudience(''));
  }
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchAudienceMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchAudienceImports = (url?: string, listId?: number, audienceId?: number) => (
  dispatch,
): Promise<IAudienceImport[]> => {
  const fetchUrl = url || getOrgApiUrl(`lists/${listId}/audiences/${audienceId}/audience_import`);
  if (!url) {
    dispatch(resetAudience(''));
  }
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchAudienceImportsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchAudienceImport = (
  listId: number,
  audienceId: number,
  AudienceImportId: number,
) => (dispatch): Promise<IAudienceImport> => {
  const fetchUrl = getOrgApiUrl(
    `lists/${listId}/audiences/${audienceId}/audience_import/${AudienceImportId}`,
  );
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchAudienceImportSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const getFileSignedUrl = (payload: any, listId: number, audienceId: number) => (
  dispatch,
): Promise<IAudienceImport> => {
  const url = getOrgApiUrl(`lists/${listId}/audiences/${audienceId}/audience_import`);
  return axios
    .post(url, payload)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const triggerFileUpload = (
  importId: string,
  listId: number,
  audienceId: number,
  payload: any,
) => (dispatch): Promise<any> => {
  const url = getOrgApiUrl(`lists/${listId}/audiences/${audienceId}/audience_import/${importId}`);
  return axios
    .patch(url, payload)
    .then(({ data }) => {
      dispatch(fetchAudienceImportSuccess(data));
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
