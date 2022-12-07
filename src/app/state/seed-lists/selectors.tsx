import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { get } from 'lodash';

export const getSeedListOptions = (state: IRedux) => {
  const organization = getActiveOrganization(state);
  const seedLists = get(organization, 'integrations.seed_list', []);

  return seedLists
    .filter(s => !s.disabled)
    .map(list => {
      return { key: list.id, text: list.name, value: list.id };
    });
};

export const getSeedLists = (state: IRedux, ids: number[] = []) => {
  const organization = getActiveOrganization(state);
  const seedLists = get(organization, 'integrations.seed_list', []).reverse();
  return seedLists
    .filter(s => !s.disabled)
    .filter(list => {
      return ids.indexOf(list.id) > -1;
    });
};
