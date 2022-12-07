import { NormalizedResults } from 'app/definitions/api';
import {
  FETCH_DOMAINS_SUCCESS,
  IGetDomainsAction,
  FETCH_DOMAIN_SUCCESS,
} from 'app/state/domains/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';
import { IDomain } from 'app/definitions/domain';

const domains = new schema.Entity('domains');

const domainsById: Reducer<NormalizedResults<IDomain>> = (
  state = {},
  action: IGetDomainsAction,
) => {
  switch (action.type) {
    case FETCH_DOMAINS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [domains]).entities.domains,
      };
    case FETCH_DOMAIN_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, domains).entities.domains,
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

const domainsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_DOMAINS_SUCCESS:
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
  byId: domainsById,
  meta: domainsMeta,
});
