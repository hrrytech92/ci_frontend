import { IRedux } from 'app/definitions/redux';
import { getOrgUrl } from 'app/state/organizations/selectors';
import { values } from 'lodash';

const getAudiences = (state: IRedux) => state.audiences.byId;
export const getAudiencesMeta = (state: IRedux) => state.audiences.meta;

export const getListAudiences = (state: IRedux, listId: number) => {
  return values(getAudiences(state))
    .reverse()
    .filter(s => s.list === listId);
};

export const getAudienceOptions = (state: IRedux, listId: number) => {
  return values(getListAudiences(state, listId)).map(audience => {
    return { key: audience.id, text: audience.name, value: audience.id };
  });
};

export const getAudience = (state: IRedux, id?: number) => {
  return getAudiences(state)[id];
};

export const getAudienceUrl = (state: IRedux, audienceId: number) => {
  const audience = getAudience(state, audienceId);
  if (audience) {
    return `${getOrgUrl(state)}lists/${audience.list}/audiences/${audienceId}`;
  }
  return '';
};

export const getAudienceMembers = (state: IRedux, audienceId: number) => {
  return values(state.audienceMembers.byId).reverse();
};
export const getAudienceMembersMeta = (state: IRedux) => {
  return state.audienceMembers.meta;
};

export const getAudienceImports = (state: IRedux, audienceId: number) => {
  return values(state.audienceImports.byId)
    .reverse()
    .filter(s => s.audience === audienceId);
};
export const getAudienceImportsMeta = (state: IRedux) => {
  return state.audienceMembers.meta;
};
