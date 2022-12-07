import { ITag } from './tag';

export interface IMessage {
  id?: number;
  url?: string;
  campaign?: number;
  name?: string;
  sender_name?: string;
  subject: string;
  sender_email?: string;
  template?: number;
  template_version?: number;
  list: number;
  domain: number;
  segment?: number;
  audience?: number;
  // turn into enum
  status?: string;
  type?: string;
  variables?: any[];
  estimated_recipients?: number;
  scheduled_send_time: string;
  actual_recipients?: number;
  seed_lists?: number[];
  suppression_lists?: number[];
  updated_on: string;
  count: number;
  scheduled_on: string | null;
  sent_on: string | null;
  list_id?: number;
  tags: ITag[];
}
