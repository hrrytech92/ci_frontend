import { ITag } from 'app/definitions/tag';
import { ActionCreator, Action } from 'redux';

export const FETCH_TAGS_SUCCESS = 'FETCH_TAGS_SUCCESS';

export interface TagsAction extends Action<typeof FETCH_TAGS_SUCCESS> {
  payload: ITag[];
}

export const fetchTagsSuccess: ActionCreator<TagsAction> = payload => ({
  payload,
  type: FETCH_TAGS_SUCCESS,
});
