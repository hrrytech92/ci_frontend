import { IPaginated } from 'app/definitions/api';
import { ITemplate } from 'app/definitions/template';
import { Action } from 'redux';

export const FETCH_TEMPLATES_SUCCESS = 'FETCH_TEMPLATES_SUCCESS ';
export const FETCH_TEMPLATE_SUCCESS = 'FETCH_TEMPLATE_SUCCESS ';
export const DISABLE_TEMPLATE_SUCCESS = 'DISABLE_TEMPLATE_SUCCESS ';
export const ENABLE_TEMPLATE_SUCCESS = 'ENABLE_TEMPLATE_SUCCESS ';

export interface TemplatesAction extends Action<typeof FETCH_TEMPLATES_SUCCESS> {
  payload: IPaginated<ITemplate>;
}

export interface TemplateAction extends Action<typeof FETCH_TEMPLATE_SUCCESS> {
  payload: ITemplate;
}

export type DetailAction = typeof ENABLE_TEMPLATE_SUCCESS | typeof DISABLE_TEMPLATE_SUCCESS;

export interface TemplateDetailAction extends Action<DetailAction> {
  payload: number;
}

export const fetchTemplatesSuccess = (payload: IPaginated<ITemplate>): TemplatesAction => ({
  payload,
  type: FETCH_TEMPLATES_SUCCESS,
});

export const fetchTemplateSuccess = (payload: ITemplate): TemplateAction => ({
  payload,
  type: FETCH_TEMPLATE_SUCCESS,
});

export const enableTemplateSuccess = (payload: number): TemplateDetailAction => ({
  payload,
  type: ENABLE_TEMPLATE_SUCCESS,
});

export const disableTemplateSuccess = (payload: number): TemplateDetailAction => ({
  payload,
  type: DISABLE_TEMPLATE_SUCCESS,
});
