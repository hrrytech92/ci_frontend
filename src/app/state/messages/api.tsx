import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { IMessage } from 'app/definitions/message';
import axios from 'app/helpers/axios';
import {
  deleteCampaignMessageSuccess,
  fetchCampaignMessagesSuccess,
  fetchCampaignMessageSuccess,
  fetchMessagesSuccess,
  fetchMessageSuccess,
} from 'app/state/messages/actions';
import { get } from 'lodash';

export const fetchCampaignMessage = (campaignId: number, messageId: number) => (
  dispatch,
): Promise<IMessage> => {
  return axios
    .get(getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchMessages = (url?: string) => (dispatch): Promise<IMessage[]> => {
  const fetchUrl = url || getOrgApiUrl(`messages/?include_disabled=true`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchMessagesSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchMessage = (messageId: number) => (dispatch): Promise<IMessage> => {
  return axios
    .get(getOrgApiUrl(`messages/${messageId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(fetchMessageSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchCampaignMessages = (campaignId?: number, url?: string) => (
  dispatch,
): Promise<IMessage[]> => {
  const fetchUrl = url || getOrgApiUrl(`campaigns/${campaignId}/messages/?include_disabled=true`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchCampaignMessagesSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addCampaignMessage = (campaignId: number, message: IMessage) => (
  dispatch,
): Promise<void> => {
  return axios
    .post(getOrgApiUrl(`campaigns/${campaignId}/messages/?include_disabled=true`), message)
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      return error;
    });
};
export const editCampaignMessage = (campaignId: number, messageId: number, message: IMessage) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(
      getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/?include_disabled=true`),
      message,
    )
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      return error;
    });
};
export const deleteCampaignMessage = (campaignId: number, messageId: number) => (
  dispatch,
): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(deleteCampaignMessageSuccess(messageId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const cloneCampaignMessage = (campaignId: number, messageId: number) => (
  dispatch,
): Promise<IMessage> => {
  return axios
    .put(
      getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/clone/?include_disabled=true`),
      {},
    )
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Message Cloned!'));
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const moveCampaignMessage = (
  currentCampaignId: number,
  futureCampaignId: number,
  messageId: number,
) => (dispatch): Promise<IMessage> => {
  return axios
    .put(
      getOrgApiUrl(`campaigns/${currentCampaignId}/messages/${messageId}`) +
        `move_campaign/?campaign_id=${futureCampaignId}`,
      {},
    )
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      dispatch(Actions.showSuccess('Message Moved!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const sendCampaignMessage = (campaignId: number, messageId: number, message: IMessage) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/send`), {})
    .then(({ data }) => {
      dispatch(fetchCampaignMessages(campaignId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const scheduleCampaignMessage = (
  campaignId: number,
  messageId: number,
  sendTime: string,
) => (dispatch): Promise<void> => {
  const scheduleUrl = getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/schedule`);
  const payload = {
    scheduled_send_time: sendTime,
  };
  return axios
    .put(scheduleUrl, payload)
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      return error;
    });
};
export const unScheduleCampaignMessage = (campaignId: number, messageId: number) => (
  dispatch,
): Promise<void> => {
  const unScheduleUrl = getOrgApiUrl(`campaigns/${campaignId}/messages/${messageId}/unschedule`);
  return axios
    .put(unScheduleUrl, {})
    .then(({ data }) => {
      dispatch(fetchCampaignMessageSuccess(data));
      return data;
    })
    .catch(error => {
      let errMsg = get(error, 'response.data.message', error);
      dispatch(Actions.showError(errMsg));
      dispatch(fetchCampaignMessages(campaignId));
      return error;
    });
};
