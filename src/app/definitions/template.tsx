import { ITag } from './tag';

export interface ITemplate {
  id: number;
  url: string;
  org: string;
  name: string;
  html_template: string;
  created_on: string;
  updated_on: string;
  variables: object;
  disabled: boolean;
  tags: ITag[];
}
