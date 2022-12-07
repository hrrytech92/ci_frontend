import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization, getOrgUrl } from 'app/state/organizations/selectors';
import { find, values, toSafeInteger, isString, get } from 'lodash';
import { getList, getListUrl } from 'app/state/lists/selectors';
import { getTemplate, getTemplateUrl } from 'app/state/templates/selectors';

export function getSubmissionForms(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  return values(state.submissionForms.byId)
    .reverse()
    .filter(sl => {
      return sl.org === currentOrg.id;
    });
}

export const getSubmissionFormsMeta = (state: IRedux) => state.submissionForms.meta;

export function getSubmissionForm(state: IRedux, SubmissionFormId: number | string) {
  if (isString(SubmissionFormId) && SubmissionFormId === 'new') {
    return {};
  } else {
    return find(getSubmissionForms(state), { id: toSafeInteger(SubmissionFormId) });
  }
}

export function getSubmissionFormRelated(state: IRedux, SubmissionFormId: number | string) {
  const form = getSubmissionForm(state, SubmissionFormId);
  const listId = get(form, 'list_subscription');
  const welcomeMessageId = get(form, 'welcome_message');
  return {
    list: getList(state, listId),
    listUrl: getListUrl(state, listId),
    welcomeMessageUrl: `${getOrgUrl(state)}welcome_messages/${welcomeMessageId}`,
    welcomeMessage: getWelcomeMessage(state, welcomeMessageId),
  };
}

export function getWelcomeMessageRelated(state: IRedux, WelcomeMessageId: number | string) {
  const form = getWelcomeMessage(state, WelcomeMessageId);
  const templateId = get(form, 'template');
  return {
    template: getTemplate(state, templateId),
    templateUrl: getTemplateUrl(state, templateId),
  };
}

export const getSubmissionFormOptions = (state: IRedux) => {
  return getSubmissionForms(state).map(sf => {
    return { key: sf.id, text: sf.name, value: sf.id };
  });
};

export function getWelcomeMessages(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  return values(state.welcomeMessages.byId)
    .reverse()
    .filter(sli => {
      return sli.org === currentOrg.id;
    });
}

export function getWelcomeMessage(state: IRedux, WelcomeMessageId) {
  if (isString(WelcomeMessageId) && WelcomeMessageId === 'new') {
    return {};
  } else {
    return find(getWelcomeMessages(state), { id: toSafeInteger(WelcomeMessageId) });
  }
}

export const getWelcomeMessagesMeta = (state: IRedux) => state.welcomeMessages.meta;

export const getWelcomeMessageOptions = (state: IRedux) => {
  return getWelcomeMessages(state).map(wm => {
    return { key: wm.id, text: wm.name, value: wm.id };
  });
};
