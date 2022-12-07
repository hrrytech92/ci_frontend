import { IPaginated } from 'app/definitions/api';
import { ICampaign } from 'app/definitions/campaign';
import { Action } from 'redux';

export const FETCH_CAMPAIGNS_SUCCESS = 'FETCH_CAMPAIGNS_SUCCESS';
export const FETCH_CAMPAIGN_SUCCESS = 'FETCH_CAMPAIGN_SUCCESS';
export const ENABLE_CAMPAIGNS_SUCCESS = 'ENABLE_CAMPAIGNS_SUCCESS';
export const DISABLE_CAMPAIGNS_SUCCESS = 'DISABLE_CAMPAIGNS_SUCCESS';

export interface CampaignsAction extends Action<typeof FETCH_CAMPAIGNS_SUCCESS> {
  payload: IPaginated<ICampaign>;
}

export interface CampaignAction extends Action<typeof FETCH_CAMPAIGN_SUCCESS> {
  payload: ICampaign;
}

export type DetailAction = typeof ENABLE_CAMPAIGNS_SUCCESS | typeof DISABLE_CAMPAIGNS_SUCCESS;
export interface CampaignDetailAction extends Action<DetailAction> {
  payload: number;
}

export const fetchCampaignsSuccess = (payload: IPaginated<ICampaign>): CampaignsAction => ({
  payload,
  type: FETCH_CAMPAIGNS_SUCCESS,
});

export const fetchCampaignSuccess = (payload: ICampaign): CampaignAction => ({
  payload,
  type: FETCH_CAMPAIGN_SUCCESS,
});

export const enableCampaignsSuccess = (payload: number): CampaignDetailAction => ({
  payload,
  type: ENABLE_CAMPAIGNS_SUCCESS,
});

export const disableCampaignsSuccess = (payload: number): CampaignDetailAction => ({
  payload,
  type: DISABLE_CAMPAIGNS_SUCCESS,
});
