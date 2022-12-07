import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization, getOrgUrl } from 'app/state/organizations/selectors';
import { values } from 'lodash';

export const getTemplate = (state: IRedux, templateId?: number) => getTemplates(state)[templateId];

export const getTemplates = (state: IRedux) => state.templates.byId;

export const getTemplatesMeta = (state: IRedux) => state.templates.meta;

export const getTemplatesForCurrentOrg = (state: IRedux) => {
  const currentOrg = getActiveOrganization(state);
  return values(getTemplates(state))
    .reverse()
    .filter(template => {
      return template.org === currentOrg.id;
    });
};

export const getTemplateOptions = (state: IRedux) => {
  return getTemplatesForCurrentOrg(state)
    .filter(t => !t.disabled)
    .map(template => {
      return { key: template.id, text: template.name, value: template.id };
    });
};

export const getTemplateHTML = (state: IRedux, templateId: number) => {
  if (templateId) {
    return getTemplate(state, templateId).html_template;
  }
};

export const getTemplateUrl = (state: IRedux, templateId: number) => {
  return `${getOrgUrl(state)}templates/${templateId}`;
};
