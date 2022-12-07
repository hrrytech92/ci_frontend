import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { ICampaign } from 'app/definitions/campaign';
import axios from 'app/helpers/axios';
import {
  disableCampaignsSuccess,
  enableCampaignsSuccess,
  fetchCampaignsSuccess,
  fetchCampaignSuccess,
} from 'app/state/campaigns/actions';

export const fetchCampaigns = (url?: string) => (dispatch): Promise<ICampaign[]> => {
  const fetchUrl = url || `${getOrgApiUrl('campaigns')}?include_disabled=true`;
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchCampaignsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchCampaign = (id: number) => (dispatch): Promise<ICampaign> => {
  const fetchUrl = getOrgApiUrl('campaigns/' + id);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchCampaignSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addCampaign = (campaign: ICampaign) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl('campaigns'), campaign)
    .then(({ data }) => {
      dispatch(fetchCampaignSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const editCampaign = (campaignId: number, campaign: ICampaign) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`campaigns/${campaignId}/?include_disabled=true`), campaign)
    .then(({ data }) => {
      dispatch(fetchCampaignSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteCampaign = (campaignId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`campaigns/${campaignId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(disableCampaignsSuccess(campaignId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const enableCampaign = (campaignId: number) => (dispatch): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`campaigns/${campaignId}/enable`), {})
    .then(() => {
      dispatch(enableCampaignsSuccess(campaignId));
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
