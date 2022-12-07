import { actionTypes } from 'app/actions/types';
import { IPaginated } from 'app/definitions/api';
import { IDomain } from 'app/definitions/domain';
import { Action, ActionCreator } from 'redux';

export interface IGetDomainsAction extends Action {
  payload: IPaginated<IDomain>;
  type: typeof actionTypes.SET_DOMAINS;
}
export interface DomainAction extends Action<typeof FETCH_DOMAIN_SUCCESS> {
  payload: IDomain;
}

export const FETCH_DOMAINS_SUCCESS = 'FETCH_DOMAINS_SUCCESS';
export const FETCH_DOMAIN_SUCCESS = 'FETCH_DOMAIN_SUCCESS';

export const fetchDomainsSuccess: ActionCreator<IGetDomainsAction> = (
  domains: IPaginated<IDomain>,
) => ({
  payload: domains,
  type: FETCH_DOMAINS_SUCCESS,
});

export const fetchDomainSuccess = (payload: IDomain): DomainAction => ({
  payload,
  type: FETCH_DOMAIN_SUCCESS,
});
