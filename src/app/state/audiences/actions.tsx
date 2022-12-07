import { IPaginated } from 'app/definitions/api';
import { Action } from 'redux';
import { IAudienceImport } from 'app/definitions/audience';

export const FETCH_AUDIENCES_SUCCESS = 'FETCH_AUDIENCES_SUCCESS';
export const FETCH_AUDIENCE_SUCCESS = 'FETCH_AUDIENCE_SUCCESS';
export const DELETE_AUDIENCE_SUCCESS = 'DELETE_AUDIENCE_SUCCESS';

export const FETCH_AUDIENCE_IMPORTS_SUCCESS = 'FETCH_AUDIENCE_IMPORTS_SUCCESS';
export const FETCH_AUDIENCE_IMPORT_SUCCESS = 'FETCH_AUDIENCE_IMPORT_SUCCESS';

export const FETCH_AUDIENCE_MEMBERS_SUCCESS = 'FETCH_AUDIENCE_MEMBERS_SUCCESS';

export const RESET_AUDIENCE = 'RESET_AUDIENCE';

export const fetchAudiencesSuccess = payload => ({
  type: FETCH_AUDIENCES_SUCCESS,
  payload,
});

export const fetchAudienceSuccess = payload => ({
  type: FETCH_AUDIENCE_SUCCESS,
  payload,
});

export const deleteAudienceSuccess = payload => ({
  type: DELETE_AUDIENCE_SUCCESS,
  payload,
});

export interface AudienceImportsAction extends Action<typeof FETCH_AUDIENCE_IMPORTS_SUCCESS> {
  payload: IPaginated<IAudienceImport>;
}

export interface AudienceImportAction extends Action<typeof FETCH_AUDIENCE_IMPORT_SUCCESS> {
  payload: IAudienceImport;
}

export const fetchAudienceImportsSuccess = (
  payload: IPaginated<IAudienceImport>,
): AudienceImportsAction => ({
  payload,
  type: FETCH_AUDIENCE_IMPORTS_SUCCESS,
});

export const fetchAudienceImportSuccess = (payload: IAudienceImport): AudienceImportAction => ({
  payload,
  type: FETCH_AUDIENCE_IMPORT_SUCCESS,
});

export const fetchAudienceMembersSuccess = payload => ({
  type: FETCH_AUDIENCE_MEMBERS_SUCCESS,
  payload,
});

export const resetAudience = payload => ({
  type: RESET_AUDIENCE,
  payload,
});
