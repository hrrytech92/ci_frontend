import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { ISubmissionForm, IWelcomeMessage } from 'app/definitions/submissionForm';
import axios from 'app/helpers/axios';
import {
  fetchSubmissionFormSuccess,
  fetchSubmissionFormsSuccess,
  fetchWelcomeMessagesSuccess,
  fetchWelcomeMessageSuccess,
  deleteSubmissionFormSuccess,
  deleteWelcomeMessageSuccess,
} from 'app/state/submission-forms/actions';

export const fetchSubmissionForms = (url?: string) => (dispatch): Promise<ISubmissionForm[]> => {
  const fetchUrl = url || getOrgApiUrl(`submission_forms`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSubmissionFormsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchSubmissionForm = submissionFormId => (dispatch): Promise<ISubmissionForm> => {
  return axios
    .get(getOrgApiUrl(`submission_forms/${submissionFormId}`))
    .then(({ data }) => {
      dispatch(fetchSubmissionFormSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteSubmissionForm = submissionFormId => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`submission_forms/${submissionFormId}`))
    .then(({ data }) => {
      dispatch(deleteSubmissionFormSuccess(submissionFormId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchWelcomeMessages = (url?: string) => (dispatch): Promise<IWelcomeMessage[]> => {
  const fetchUrl = url || getOrgApiUrl(`welcome_messages`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchWelcomeMessagesSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchWelcomeMessage = welcomeMessageId => (dispatch): Promise<IWelcomeMessage> => {
  const fetchUrl = getOrgApiUrl(`welcome_messages/${welcomeMessageId}`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchWelcomeMessageSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveSubmissionForm = (submissionForm: ISubmissionForm) => (
  dispatch,
): Promise<void> => {
  let request;
  if (submissionForm.id) {
    request = axios.put(getOrgApiUrl(`submission_forms/${submissionForm.id}`), submissionForm);
  } else {
    request = axios.post(getOrgApiUrl('submission_forms'), submissionForm);
  }
  return request
    .then(({ data }) => {
      dispatch(fetchSubmissionFormSuccess(data));
      dispatch(Actions.showSuccess('Form Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const saveWelcomeMessage = (welcomeMessage: IWelcomeMessage) => (
  dispatch,
): Promise<void> => {
  let request;
  if (welcomeMessage.id) {
    request = axios.put(getOrgApiUrl(`welcome_messages/${welcomeMessage.id}`), welcomeMessage);
  } else {
    request = axios.post(getOrgApiUrl('welcome_messages'), welcomeMessage);
  }
  return request
    .then(({ data }) => {
      dispatch(fetchWelcomeMessageSuccess(data));
      dispatch(Actions.showSuccess('Welcome Message Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const deleteWelcomeMessage = welcomeMessageId => (dispatch): Promise<void> => {
  return axios
    .delete(getOrgApiUrl(`welcome_messages/${welcomeMessageId}`))
    .then(({ data }) => {
      dispatch(deleteWelcomeMessageSuccess(welcomeMessageId));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
