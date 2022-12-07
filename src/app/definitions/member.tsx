import { ISubscriber } from './subscriber';

export interface IMember {
  double_opt: string;
  last_click: string;
  last_email: string;
  last_open: string;
  status_display: string;
  status: string;
  subscribe_date: string;
  subscriber: ISubscriber;
  id: number;
}
