import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { find, values } from 'lodash';

export function getSuppressionLists(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  return values(state.suppressionLists.byId)
    .reverse()
    .filter(sl => {
      return sl.org === currentOrg.id;
    });
}

export const getSuppressionListsForMessage = (state: IRedux, ids: any[] = []) => {
  return getSuppressionLists(state).filter(sl => {
    return ids.indexOf(sl.id) > -1;
  });
};

export const getSuppressionListsMeta = (state: IRedux) => state.suppressionLists.meta;

export function getSuppressionList(state: IRedux, suppressionListId) {
  return find(getSuppressionLists(state), { id: suppressionListId });
}

export const getSuppressionListMembers = (state: IRedux, suppressionListId) => {
  return values(state.suppressionListMembers.byId)
    .reverse()
    .filter(se => se.suppression_list_id === suppressionListId);
};

export const getSuppressionListMembersMeta = (state: IRedux) => {
  return state.suppressionListMembers.meta;
};

export const getSuppressionListOptions = (state: IRedux) => {
  return getSuppressionLists(state).map(sl => {
    return { key: sl.id, text: sl.name, value: sl.id };
  });
};

export function getSuppressionListImports(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  return values(state.suppressionListImports.byId)
    .reverse()
    .filter(sli => {
      return sli.org === currentOrg.id;
    });
}

export function getSuppressionListImport(state: IRedux, suppressionListImportId) {
  return find(getSuppressionListImports(state), { id: suppressionListImportId });
}

export const getSuppressionListImportsMeta = (state: IRedux) => state.suppressionListImports.meta;
