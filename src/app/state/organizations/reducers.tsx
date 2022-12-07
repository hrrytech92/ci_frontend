import { NormalizedResults } from 'app/definitions/api';
import { IOrganization } from 'app/definitions/organization';
import {
  ADD_INTEGRATION,
  DELETE_ORG_SUCCESS,
  FETCH_ORGS_SUCCESS,
  IntegrationAction,
  OrgDetailAction,
  OrgListAction,
  SET_ORG,
} from 'app/state/organizations/actions';
import { Reducer } from 'redux';
import { omit } from 'lodash';
import update from 'immutability-helper';

type IAction = OrgListAction | OrgDetailAction | IntegrationAction;

export const organizations: Reducer<NormalizedResults<IOrganization>, IAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case ADD_INTEGRATION:
      const { orgId, integration } = action.payload;

      const updatedOrg = update(state[orgId], {
        integrations: {
          [integration]: {
            $unshift: [
              {
                new: true,
                esp_name: integration,
              },
            ],
          },
        },
      });
      return {
        ...state,
        [orgId]: updatedOrg,
      };
    case DELETE_ORG_SUCCESS:
      return omit(state, action.payload);
    case FETCH_ORGS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const activeOrg: Reducer<string> = (state = '', action) => {
  switch (action.type) {
    case SET_ORG:
      return action.payload;
    default:
      return state;
  }
};
