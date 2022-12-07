import { IPaginated } from 'app/definitions/api';
import { Action } from 'redux';
import { ISubmissionForm, IWelcomeMessage } from 'app/definitions/submissionForm';

export const FETCH_SUBMISSION_FORMS_SUCCESS = 'FETCH_SUBMISSION_FORMS_SUCCESS';
export const DELETE_SUBMISSION_FORM_SUCCESS = 'DELETE_SUBMISSION_FORM_SUCCESS';
export const DELETE_WELCOME_MESSAGE_SUCCESS = 'DELETE_WELCOME_MESSAGE_SUCCESS';
export const FETCH_WELCOME_MESSAGES_SUCCESS = 'FETCH_WELCOME_MESSAGES_SUCCESS';
export const FETCH_WELCOME_MESSAGE_SUCCESS = 'FETCH_WELCOME_MESSAGE_SUCCESS';
export const FETCH_SUBMISSION_FORM_SUCCESS = 'FETCH_SUBMISSION_FORM_SUCCESS';

export interface SubmissionFormsAction extends Action<typeof FETCH_SUBMISSION_FORMS_SUCCESS> {
  payload: IPaginated<ISubmissionForm>;
}

export interface SubmissionFormAction
  extends Action<typeof FETCH_SUBMISSION_FORM_SUCCESS | typeof DELETE_SUBMISSION_FORM_SUCCESS> {
  payload: ISubmissionForm;
}

export interface WelcomeMessagesAction extends Action<typeof FETCH_WELCOME_MESSAGES_SUCCESS> {
  payload: IPaginated<IWelcomeMessage>;
}

export interface WelcomeMessageAction
  extends Action<typeof FETCH_WELCOME_MESSAGE_SUCCESS | typeof DELETE_WELCOME_MESSAGE_SUCCESS> {
  payload: IWelcomeMessage;
}

export const fetchSubmissionFormsSuccess = (
  payload: IPaginated<ISubmissionForm>,
): SubmissionFormsAction => ({
  payload,
  type: FETCH_SUBMISSION_FORMS_SUCCESS,
});

export const fetchWelcomeMessagesSuccess = (
  payload: IPaginated<IWelcomeMessage>,
): WelcomeMessagesAction => ({
  payload,
  type: FETCH_WELCOME_MESSAGES_SUCCESS,
});

export const fetchWelcomeMessageSuccess = (payload: IWelcomeMessage): WelcomeMessageAction => ({
  payload,
  type: FETCH_WELCOME_MESSAGE_SUCCESS,
});

export const fetchSubmissionFormSuccess = (payload: ISubmissionForm): SubmissionFormAction => ({
  payload,
  type: FETCH_SUBMISSION_FORM_SUCCESS,
});

export const deleteSubmissionFormSuccess = payload => {
  return {
    payload,
    type: DELETE_SUBMISSION_FORM_SUCCESS,
  };
};

export const deleteWelcomeMessageSuccess = payload => {
  return {
    payload,
    type: DELETE_WELCOME_MESSAGE_SUCCESS,
  };
};
