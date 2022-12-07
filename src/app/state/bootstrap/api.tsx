import { fetchCampaigns } from 'app/state/campaigns/api';
import { fetchMessages } from 'app/state/messages/api';
import { fetchDomains } from 'app/state/domains/api';
import { fetchLists } from 'app/state/lists/api';
import { fetchTemplates } from 'app/state/templates/api';
import { fetchBulkDonationImports } from 'app/state/payments/api';
import { getOrgUsers } from 'app/state/users/api';
import { fetchClients } from 'app/state/clients/api';
import {
  fetchSuppressionLists,
  fetchSuppressionListImports,
} from 'app/state/suppression-lists/api';
import { fetchSubmissionForms, fetchWelcomeMessages } from '../submission-forms/api';

export const loadBootstrapData = () => dispatch => {
  dispatch(fetchDomains());
  dispatch(fetchLists());
  dispatch(fetchTemplates());
  dispatch(fetchCampaigns());
  dispatch(fetchMessages());
  dispatch(getOrgUsers(''));
  dispatch(fetchClients());
  dispatch(fetchSuppressionLists(''));
  dispatch(fetchSuppressionListImports(''));
  dispatch(fetchSubmissionForms(''));
  dispatch(fetchWelcomeMessages(''));
  dispatch(fetchBulkDonationImports());
};
