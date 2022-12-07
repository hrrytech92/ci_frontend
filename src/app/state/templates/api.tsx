import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { ITemplate } from 'app/definitions/template';
import axios from 'app/helpers/axios';
import {
  disableTemplateSuccess,
  enableTemplateSuccess,
  fetchTemplatesSuccess,
  fetchTemplateSuccess,
} from 'app/state/templates/actions';

export const fetchTemplates = (url?: string) => (dispatch): Promise<ITemplate[]> => {
  const fetchUrl = url || `${getOrgApiUrl('templates')}?include_disabled=true`;

  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchTemplatesSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchTemplate = templateId => (dispatch): Promise<ITemplate> => {
  return axios
    .get(getOrgApiUrl(`templates/${templateId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(fetchTemplateSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const editTemplate = (templateId: number, template: ITemplate) => (
  dispatch,
): Promise<void> => {
  dispatch(Actions.noLoading());
  return axios
    .put(getOrgApiUrl(`templates/${templateId}`), template)
    .then(({ data }) => {
      dispatch(fetchTemplateSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addTemplate = (template: ITemplate) => (dispatch): Promise<ITemplate> => {
  return axios
    .post(getOrgApiUrl(`templates`), template)
    .then(({ data }) => {
      dispatch(fetchTemplateSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteTemplate = (templateId: number) => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`templates/${templateId}`))
    .then(() => {
      dispatch(disableTemplateSuccess(templateId));
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const enableTemplate = (templateId: number) => (dispatch): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`templates/${templateId}/enable`), {})
    .then(() => {
      dispatch(enableTemplateSuccess(templateId));
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
