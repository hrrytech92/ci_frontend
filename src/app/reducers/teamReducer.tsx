import { Reducer } from 'redux';
import { ISetTeamsAction } from '../state/organizations/actions';
import { actionTypes } from '../actions/types';
import { ITeam } from '../definitions/team';

export const teams: Reducer<ITeam[]> = (state: ITeam[] = [], action: ISetTeamsAction) => {
  switch (action.type) {
    case actionTypes.SET_TEAMS:
      return action.teams;
    default:
      return state;
  }
};
