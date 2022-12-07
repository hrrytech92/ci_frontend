import store from 'app/store';

export const getOrgApiUrl = (path: string) => {
  const orgId = store.getState().activeOrg;
  if (orgId) {
    return `/organizations/${orgId}/${path}/`;
  }
};
