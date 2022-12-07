import { IRedux } from 'app/definitions/redux';
import { values } from 'lodash';

export const getMessage = (state: IRedux, messageId: number | string) => {
  return state.campaignMessages.byId[messageId];
};

export const getMessagesForCampaign = (state: IRedux, campaignId: number) => {
  return values(state.campaignMessages.byId)
    .reverse()
    .filter(m => m.campaign === campaignId);
};

export const getMessagesForCampaignMeta = (state: IRedux) => state.campaignMessages.meta;

export const getMessages = (state: IRedux) => {
  return values(state.messages.byId).reverse();
};

export const getMessagesMeta = (state: IRedux) => state.messages.meta;

export const getMessageOptions = (state: IRedux) => {
  return getMessages(state).map(message => {
    return {
      key: message.id,
      text: message.id.toString() + '-' + message.name,
      value: message.id,
    };
  });
};
