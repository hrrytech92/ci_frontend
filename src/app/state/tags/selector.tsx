import { IRedux } from 'app/definitions/redux';
import { ITag } from 'app/definitions/tag';

export const getTagsForCurrentOrg = (state: IRedux): ITag[] => {
  return state.tags.byId.tags;
};

export const getTags = (state: IRedux) => {
  return state.tags.byId.tags ? state.tags.byId.tags : [];
};

export const getTag = (state: IRedux, tagId?: number) => {
  const tag = getTags(state).filter(t => t.id === tagId)[0];
  return tag;
};
