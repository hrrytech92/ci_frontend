import { IList } from 'app/definitions/list';
import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization, getOrgUrl } from 'app/state/organizations/selectors';
import { values } from 'lodash';

export const getList = (state: IRedux, listId: number) => getLists(state)[listId];

export const getLists = (state: IRedux) => state.lists.byId;

export const getListsMeta = (state: IRedux) => state.lists.meta;

export const getListOptions = (state: IRedux) => {
  return getListsForCurrentOrg(state)
    .filter(l => !l.disabled)
    .map(list => {
      return { key: list.id, text: list.list_name, value: list.id };
    });
};

export const getListMembers = (state: IRedux) => {
  return values(state.listMembers.byId).reverse();
};

export const getListMembersMeta = (state: IRedux) => {
  return state.listMembers.meta;
};

export const getListsForCurrentOrg = (state: IRedux): IList[] => {
  const currentOrg = getActiveOrganization(state);
  return values(getLists(state))
    .reverse()
    .filter(list => {
      return list.org === currentOrg.id;
    });
};

export const getActiveListsForCurrentOrg = (state: IRedux): IList[] => {
  const lists = getListsForCurrentOrg(state);

  return values(lists)
    .reverse()
    .filter(list => {
      return list.disabled === false;
    });
};

export const getListUrl = (state: IRedux, listId: number) => {
  return `${getOrgUrl(state)}lists/${listId}`;
};

export const getListsUrl = (state: IRedux) => {
  return `${getOrgUrl(state)}lists`;
};
