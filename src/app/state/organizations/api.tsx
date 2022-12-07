import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IFileImport } from 'app/definitions/fileImport';
import {
  IMailgunAccount,
  IPostalAccount,
  ISeedList,
  ISendgridAccount,
  IAnedotAccount,
} from 'app/definitions/integrations';
import { IOrganization } from 'app/definitions/organization';
import { ITeam } from 'app/definitions/team';
import axios from 'app/helpers/axios';
import { deleteOrgSuccess, fetchOrgsSuccess, setTeams } from 'app/state/organizations/actions';
import axios2 from 'axios';

import { normalize, schema } from 'normalizr';

const organizations = new schema.Entity('organizations');

export const fetchOrgs = params => (dispatch): Promise<IOrganization[]> => {
  return axios
    .get(`/organizations/`, { params })
    .then(({ data }) => {
      const normalized = normalize(data.results, [organizations]);
      dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const getOrgDetail = id => (dispatch): Promise<IOrganization> => {
  return axios
    .get(`/organizations/${id}/`)
    .then(({ data }) => {
      const normalized = normalize(data, organizations);
      dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addOrg = (org: IOrganization) => (dispatch): Promise<IOrganization> => {
  return axios
    .post(`/organizations/`, org)
    .then(({ data }) => {
      const normalized = normalize(data, organizations);
      dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const editOrg = (id: number, org: IOrganization) => (dispatch): Promise<IOrganization> => {
  return axios
    .patch(`/organizations/${id}/`, org)
    .then(({ data }) => {
      const normalized = normalize(data, organizations);
      dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteOrg = id => (dispatch): Promise<IOrganization> => {
  return axios
    .delete(`/organizations/${id}`)
    .then(({ data }) => {
      dispatch(deleteOrgSuccess(id));
      dispatch(Actions.showSuccess('Organization deleted'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const getTeams = params => (dispatch): Promise<ITeam[]> => {
  return axios
    .get(`/teams` + params)
    .then(({ data }) => {
      dispatch(setTeams(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const getTeam = (teamId: number) => (dispatch): Promise<ITeam> => {
  return axios
    .get(`/teams/${teamId}`)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addTeam = (team: ITeam) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('teams'), team)
    .then(({ data }) => {
      dispatch(getTeams(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const editTeam = (teamId: number, team: ITeam) => (dispatch, getState): Promise<void> => {
  dispatch(Actions.noLoading());
  const org = getState().organization.id;
  return axios
    .put(`/teams/${teamId}/`, { ...team, org })
    .then(({ data }) => {
      dispatch(getTeams(''));
      dispatch(Actions.showSuccess('Team Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteTeam = (teamId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`teams/${teamId}`))
    .then(({ data }) => {
      dispatch(getTeams(''));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const getFileSignedUrl = (payload: any) => (dispatch): Promise<IFileImport> => {
  return axios
    .post(getOrgApiUrl(`file_imports`), payload)
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
    .patch(getOrgApiUrl(`file_imports/${importId}`), payload)
    .then(({ data }) => {
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
export const addSeedList = (seedList: ISeedList) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('integrations/seed_list'), seedList)
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const saveSeedList = (seedList: ISeedList) => (dispatch): Promise<void> => {
  let request;

  if (seedList.id) {
    request = axios.put(
      getOrgApiUrl(`integrations/seed_list/${seedList.id}/?include_disabled=true`),
      seedList,
    );
  } else {
    request = axios.post(getOrgApiUrl('integrations/seed_list'), seedList);
  }

  return request
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Seed List Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteSeedList = (seedListId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`integrations/seed_list/${seedListId}/?include_disabled=true`))
    .then(({ data }) => {
      const orgUrl = getOrgApiUrl('').replace('//', '/');
      axios.get(orgUrl).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Seed List Disabled!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const enableSeedList = (seedListId: number) => (dispatch): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`integrations/seed_list/${seedListId}/?include_disabled=true`), {})
    .then(() => {
      const orgUrl = getOrgApiUrl('').replace('//', '/');
      axios.get(orgUrl).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Seed List Enabled!'));
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveMailgunAccount = (account: IMailgunAccount) => (dispatch): Promise<void> => {
  let request;
  if (account.id) {
    request = axios.put(getOrgApiUrl(`integrations/mailgun/${account.id}`), account);
  } else {
    request = axios.post(getOrgApiUrl('integrations/mailgun'), account);
  }

  return request
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Mailgun Account Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.setViewLoading(false));
      dispatch(Actions.showError(error));
      return error;
    });
};

export const savePostalAccount = (account: IPostalAccount) => (dispatch): Promise<void> => {
  let request;
  if (account.id) {
    request = axios.put(getOrgApiUrl(`integrations/postal/${account.id}`), account);
  } else {
    request = axios.post(getOrgApiUrl('integrations/postal'), account);
  }

  return request
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Postal Account Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.setViewLoading(false));
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveSendgridAccount = (account: ISendgridAccount) => (dispatch): Promise<void> => {
  let request;
  if (account.id) {
    request = axios.put(getOrgApiUrl(`integrations/sendgrid/${account.id}`), account);
  } else {
    request = axios.post(getOrgApiUrl('integrations/sendgrid'), account);
  }

  return request
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Sendgrid Account Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveAnedotAccount = (account: IAnedotAccount) => (dispatch): Promise<void> => {
  let request;
  if (account.id) {
    request = axios.put(getOrgApiUrl(`integrations/anedot/${account.id}`), account);
  } else {
    request = axios.post(getOrgApiUrl('integrations/anedot'), account);
  }

  return request
    .then(({ data }) => {
      const orgID = data.org;
      axios.get(`/organizations/${orgID}/`).then(({ data }) => {
        const normalized = normalize(data, organizations);
        dispatch(fetchOrgsSuccess(normalized.entities.organizations));
      });
      dispatch(Actions.showSuccess('Anedot Account Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
