import axios from 'app/helpers/axios';
import Actions from 'app/actions/actions';
import { ITag } from 'app/definitions/tag';
import { getOrgApiUrl } from 'app/actions/url';
import { fetchTagsSuccess } from './actions';
import { ITemplate } from 'app/definitions/template';

export const fetchTags = () => (dispatch): Promise<ITag[]> => {
  return axios
    .get(getOrgApiUrl('tags'))
    .then(({ data }) => {
      dispatch(fetchTagsSuccess(data.results));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchTemplateTags = (templateId: string) => (dispatch): Promise<ITag[]> => {
  return axios
    .get(getOrgApiUrl('template/' + templateId + '/tags'))
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchTemplatesForTag = (tagId: number) => (dispatch): Promise<ITag[]> => {
  return axios
    .get(getOrgApiUrl('tags/' + tagId + '/templates'))
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchMessagesForTag = (tagId: number) => (dispatch): Promise<ITag[]> => {
  return axios
    .get(getOrgApiUrl('tags/' + tagId + '/messages'))
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addTag = (tag: ITag) => (dispatch): Promise<ITag> => {
  return axios
    .post(getOrgApiUrl('tags'), tag)
    .then(({ data }) => {
      fetchTags();
      dispatch(Actions.showSuccess('Tag Created!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const addTagToTemplate = (template: ITemplate) => (dispatch): Promise<ITag> => {
  return axios
    .put(getOrgApiUrl(`templates/${template.id}`), template)
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Tag Applied!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return Promise.reject(error);
    });
};

export const editTag = (tag: ITag) => (dispatch): Promise<ITag> => {
  return axios
    .patch(getOrgApiUrl(`tags/${tag.id}`), {
      name: tag.name,
    })
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Tag Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteTag = (id: string) => (dispatch): Promise<ITag> => {
  return axios
    .delete(getOrgApiUrl(`tags/${id}`))
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Tag Deleted!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
