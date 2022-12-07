import { NormalizedResults } from 'app/definitions/api';
import { ICampaign } from 'app/definitions/campaign';
import {
  CampaignAction,
  CampaignDetailAction,
  CampaignsAction,
  DISABLE_CAMPAIGNS_SUCCESS,
  ENABLE_CAMPAIGNS_SUCCESS,
  FETCH_CAMPAIGN_SUCCESS,
  FETCH_CAMPAIGNS_SUCCESS,
} from 'app/state/campaigns/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IAction = CampaignsAction | CampaignAction | CampaignDetailAction;

const campaigns = new schema.Entity('campaigns');

const campaignsById: Reducer<NormalizedResults<ICampaign>, IAction> = (state = {}, action) => {
  switch (action.type) {
    case DISABLE_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: true,
        },
      };
    case ENABLE_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          disabled: false,
        },
      };

    case FETCH_CAMPAIGN_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, campaigns).entities.campaigns,
      };
    case FETCH_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [campaigns]).entities.campaigns,
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

const campaignsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGNS_SUCCESS:
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
  byId: campaignsById,
  meta: campaignsMeta,
});
