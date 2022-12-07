export const FETCH_CAMPAIGN_MESSAGES_SUCCESS = 'FETCH_CAMPAIGN_MESSAGES_SUCCESS';
export const FETCH_CAMPAIGN_MESSAGE_SUCCESS = 'FETCH_CAMPAIGN_MESSAGE_SUCCESS';
export const DELETE_CAMPAIGN_MESSAGES_SUCCESS = 'DELETE_CAMPAIGN_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS';

export const fetchMessagesSuccess = payload => {
  return {
    type: FETCH_MESSAGES_SUCCESS,
    payload,
  };
};

export const fetchMessageSuccess = payload => {
  return {
    type: FETCH_MESSAGE_SUCCESS,
    payload,
  };
};

export const fetchCampaignMessagesSuccess = payload => {
  return {
    type: FETCH_CAMPAIGN_MESSAGES_SUCCESS,
    payload,
  };
};

export const fetchCampaignMessageSuccess = payload => {
  return {
    payload,
    type: FETCH_CAMPAIGN_MESSAGE_SUCCESS,
  };
};

export const deleteCampaignMessageSuccess = payload => {
  return {
    type: DELETE_CAMPAIGN_MESSAGES_SUCCESS,
    payload,
  };
};
