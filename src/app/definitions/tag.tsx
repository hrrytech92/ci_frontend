import { IMessage } from './message';
import { ITemplate } from './template';

export interface ITag {
  id?: number;
  name: string;
  org?: string;
  templates?: ITemplate[];
  messages?: IMessage[];
}
