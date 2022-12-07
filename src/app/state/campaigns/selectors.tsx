// import { IClient } from 'app/definitions/client';
import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { values } from 'lodash';
import { getClientsForCurrentOrg } from '../clients/selectors';

export const getCampaign = (state: IRedux, campaignId: number) => getCampaigns(state)[campaignId];

export const getCampaigns = (state: IRedux) => state.campaigns.byId;

export const getCampaignsMeta = (state: IRedux) => state.campaigns.meta;

export const getCampaignsForCurrentOrg = (state: IRedux) => {
  const currentOrg = getActiveOrganization(state);

  return values(getCampaigns(state))
    .reverse()
    .filter(campaign => {
      return campaign.org === currentOrg.id;
    });
};

export const getCampaignUrl = (state: IRedux, campaignId: number) => {
  const campaign = getCampaign(state, campaignId);

  if (campaign) {
    return `/org/${campaign.org}/campaigns/${campaign.id}`;
  }
  return '';
};

export const getCampaignOptions = (state: IRedux) => {
  return getCampaignsForCurrentOrg(state).map(campaign => {
    return {
      key: campaign.id,
      text: campaign.id.toString() + '-' + campaign.name,
      value: campaign.id,
    };
  });
};

export const getClientListOptions = (state: IRedux) => {
  const clients = getClientsForCurrentOrg(state).filter(s => s.is_active === true);
  return clients.map(client => {
    return { key: client.id, text: client.name, value: client.id };
  });
};
