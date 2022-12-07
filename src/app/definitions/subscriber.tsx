export interface ISubscriber {
  url: string;
  id: string;
  org: string;
  email: string;
  email_md5: string;
  validation_status: string;
  validation_sub_status: string;
  created_on: string;
  updated_on: string;
  opt_in_date: Date;
  custom_data: object;
  subscriptions: ISubscription[];
}

export interface ISubscription {
  double_opt: string;
  last_click: string;
  last_email: string;
  last_open: string;
  list_id: string;
  list_name: string;
  status: string;
  subscribe_date: string;
}
