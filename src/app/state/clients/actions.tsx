import { IPaginated } from 'app/definitions/api';
import { IClient } from 'app/definitions/client';
import { Action, ActionCreator } from 'redux';

export const FETCH_CLIENTS_SUCCESS = 'FETCH_CLIENTS_SUCCESS';
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS';
export const DISABLE_CLIENT_SUCCESS = 'DISABLE_CLIENT_SUCCESS';
export const ENABLE_CLIENT_SUCCESS = 'ENABLE_CLIENT_SUCCESS';

export interface ClientsAction extends Action<typeof FETCH_CLIENTS_SUCCESS> {
  payload: IPaginated<IClient>;
}
export interface ClientAction extends Action<typeof FETCH_CLIENT_SUCCESS> {
  payload: IClient;
}
type DetailAction = typeof DISABLE_CLIENT_SUCCESS | typeof ENABLE_CLIENT_SUCCESS;
export interface ClientDetailAction extends Action<DetailAction> {
  payload: number;
}

export const fetchClientsSuccess: ActionCreator<ClientsAction> = payload => ({
  payload,
  type: FETCH_CLIENTS_SUCCESS,
});

export const fetchClientSuccess = (payload: IClient): ClientAction => ({
  payload,
  type: FETCH_CLIENT_SUCCESS,
});

export const disableClientSuccess = (payload: number): ClientDetailAction => ({
  payload,
  type: DISABLE_CLIENT_SUCCESS,
});

export const enableClientSuccess = payload => ({
  payload,
  type: ENABLE_CLIENT_SUCCESS,
});
