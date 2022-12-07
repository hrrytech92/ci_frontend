import { ITag } from 'app/definitions/tag';
import { combineReducers, Reducer } from 'redux';
import { FETCH_TAGS_SUCCESS, TagsAction } from './actions';

type IAction = TagsAction;

const tagsByID: Reducer<ITag[], IAction> = (state: any = {}, action) => {
  switch (action.type) {
    case FETCH_TAGS_SUCCESS:
      console.log('FETCH_TAGS_SUCCESS: ', action.payload);
      return {
        ...state,
        tags: action.payload,
      };
    default:
      return state;
  }
};

export const tags = combineReducers({
  byId: tagsByID,
});
