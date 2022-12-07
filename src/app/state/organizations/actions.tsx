import { actionTypes } from 'app/actions/types';
import { NormalizedResults } from 'app/definitions/api';
import { IOrganization } from 'app/definitions/organization';
import { ITeam } from 'app/definitions/team';
import { Action, ActionCreator } from 'redux';

export const ADD_INTEGRATION = 'ADD_INTEGRATION';
export const FETCH_ORGS_SUCCESS = 'FETCH_ORGS_SUCCESS';
export const DELETE_ORG_SUCCESS = 'DELETE_ORG_SUCCESS';
export const SET_ORG = 'SET_ORG';

type AddIntegrationPayload = {
  integration: 'sendgrid' | 'mailgun' | 'postal';
  orgId: string;
};

export interface OrgListAction extends Action<typeof FETCH_ORGS_SUCCESS> {
  payload: NormalizedResults<IOrganization>;
}

export interface OrgDetailAction extends Action<typeof DELETE_ORG_SUCCESS> {
  payload: string;
}

export interface IntegrationAction extends Action<typeof ADD_INTEGRATION> {
  payload: AddIntegrationPayload;
}

export const fetchOrgsSuccess = (payload: NormalizedResults<IOrganization>): OrgListAction => ({
  payload,
  type: FETCH_ORGS_SUCCESS,
});

export const deleteOrgSuccess = (payload: string): OrgDetailAction => ({
  payload,
  type: DELETE_ORG_SUCCESS,
});

export interface ISetTeamsAction extends Action {
  teams: ITeam[];
  type: typeof actionTypes.SET_TEAMS;
}

export const setTeams: ActionCreator<ISetTeamsAction> = (teams: ITeam[]) => ({
  teams,
  type: actionTypes.SET_TEAMS,
});

export interface ISetOrganizationAction extends Action {
  payload: string;
  type: typeof SET_ORG;
}

export const setOrg: ActionCreator<ISetOrganizationAction> = (payload: string) => {
  return {
    payload,
    type: SET_ORG,
  };
};

export const addIntegration = (payload: AddIntegrationPayload): IntegrationAction => {
  return { payload, type: ADD_INTEGRATION };
};
