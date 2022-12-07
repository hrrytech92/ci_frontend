import { NormalizedResults } from 'app/definitions/api';
import { ISubscriber } from 'app/definitions/subscriber';
import { IAudience, IAudienceImport } from 'app/definitions/audience';
import {
  FETCH_AUDIENCE_SUCCESS,
  FETCH_AUDIENCES_SUCCESS,
  DELETE_AUDIENCE_SUCCESS,
  FETCH_AUDIENCE_MEMBERS_SUCCESS,
  RESET_AUDIENCE,
  FETCH_AUDIENCE_IMPORTS_SUCCESS,
} from 'app/state/audiences/actions';

import { omit } from 'lodash';
import { normalize, schema } from 'normalizr';
import { Reducer, combineReducers } from 'redux';

const audiencesSchema = new schema.Entity('audiences');
const audienceMembersSchema = new schema.Entity('audienceMembers');
const audienceImportsSchema = new schema.Entity('audienceImports');

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const audiencesByID: Reducer<NormalizedResults<IAudience>> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_AUDIENCE_SUCCESS:
      const normalizedAudience = normalize(action.payload, audiencesSchema);
      return {
        ...state,
        ...normalizedAudience.entities.audiences,
      };
    case FETCH_AUDIENCES_SUCCESS:
      const normalizedAudiences = normalize(action.payload.results, [audiencesSchema]);
      return {
        ...state,
        ...normalizedAudiences.entities.audiences,
      };
    case DELETE_AUDIENCE_SUCCESS:
      return omit(state, action.payload);
    default:
      return state;
  }
};

const audiencesPaginationMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_AUDIENCES_SUCCESS:
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

const audienceMembersByID: Reducer<NormalizedResults<ISubscriber>> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_AUDIENCE_MEMBERS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [audienceMembersSchema]).entities.audienceMembers,
      };
    case RESET_AUDIENCE:
      return {};
    default:
      return state;
  }
};

const audienceMembersMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_AUDIENCE_MEMBERS_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    case RESET_AUDIENCE:
      return metaInitial;
    default:
      return state;
  }
};

const audienceImportsByID: Reducer<NormalizedResults<IAudienceImport>> = (state = {}, action) => {
  switch (action.type) {
    case FETCH_AUDIENCE_IMPORTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [audienceImportsSchema]).entities.audienceImports,
      };
    case RESET_AUDIENCE:
      return {};
    default:
      return state;
  }
};

const audienceImportsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_AUDIENCE_IMPORTS_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    case RESET_AUDIENCE:
      return metaInitial;
    default:
      return state;
  }
};

export const audienceMembers = combineReducers({
  byId: audienceMembersByID,
  meta: audienceMembersMeta,
});

export const audiences = combineReducers({
  byId: audiencesByID,
  meta: audiencesPaginationMeta,
});

export const audienceImports = combineReducers({
  byId: audienceImportsByID,
  meta: audienceImportsMeta,
});
