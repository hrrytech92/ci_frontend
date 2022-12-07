import { NormalizedResults } from 'app/definitions/api';
import { ITemplate } from 'app/definitions/template';
import {
  DISABLE_TEMPLATE_SUCCESS,
  ENABLE_TEMPLATE_SUCCESS,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATE_SUCCESS,
  TemplateAction,
  TemplatesAction,
  TemplateDetailAction,
} from 'app/state/templates/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IAction = TemplatesAction | TemplateAction | TemplateDetailAction;

const templates = new schema.Entity('templates');

const templatesById: Reducer<NormalizedResults<ITemplate>, IAction> = (state = {}, action) => {
  switch (action.type) {
    case DISABLE_TEMPLATE_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: true,
        },
      };
    case ENABLE_TEMPLATE_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: false,
        },
      };

    case FETCH_TEMPLATE_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, templates).entities.templates,
      };
    case FETCH_TEMPLATES_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [templates]).entities.templates,
      };
    default:
      return state;
  }
};

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const templatesMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_TEMPLATES_SUCCESS:
      const { count, next, previous } = action.payload;

      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

export default combineReducers({
  byId: templatesById,
  meta: templatesMeta,
});
