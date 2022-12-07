import { NormalizedResults } from 'app/definitions/api';
import { ISubmissionForm, IWelcomeMessage } from 'app/definitions/submissionForm';
import {
  FETCH_SUBMISSION_FORMS_SUCCESS,
  FETCH_WELCOME_MESSAGES_SUCCESS,
  FETCH_WELCOME_MESSAGE_SUCCESS,
  FETCH_SUBMISSION_FORM_SUCCESS,
  DELETE_SUBMISSION_FORM_SUCCESS,
  DELETE_WELCOME_MESSAGE_SUCCESS,
} from 'app/state/submission-forms/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';
import { omit } from 'lodash';

type WelcomeMessageAction = {
  payload: any;
  type: string;
};

type SubmissionFormAction = {
  payload: any;
  type: string;
};

const submissionFormsSchema = new schema.Entity('submissionForms');
const welcomeMessagesSchema = new schema.Entity('welcomeMessages');

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const submissionFormsById: Reducer<NormalizedResults<ISubmissionForm>, SubmissionFormAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case DELETE_SUBMISSION_FORM_SUCCESS:
      return omit(state, action.payload);
    case FETCH_SUBMISSION_FORM_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, submissionFormsSchema).entities.submissionForms,
      };
    case FETCH_SUBMISSION_FORMS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [submissionFormsSchema]).entities.submissionForms,
      };
    default:
      return state;
  }
};

const submissionFormsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_SUBMISSION_FORMS_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

export const submissionForms = combineReducers({
  byId: submissionFormsById,
  meta: submissionFormsMeta,
});

const welcomeMessagesById: Reducer<NormalizedResults<IWelcomeMessage>, WelcomeMessageAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case FETCH_WELCOME_MESSAGE_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, welcomeMessagesSchema).entities.welcomeMessages,
      };
    case DELETE_WELCOME_MESSAGE_SUCCESS:
      return omit(state, action.payload);
    case FETCH_WELCOME_MESSAGES_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [welcomeMessagesSchema]).entities.welcomeMessages,
      };
    default:
      return state;
  }
};

const welcomeMessagesMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_WELCOME_MESSAGES_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

export const welcomeMessages = combineReducers({
  byId: welcomeMessagesById,
  meta: welcomeMessagesMeta,
});
