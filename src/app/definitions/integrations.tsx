export interface IMailgunAccount {
  id: string;
  new?: boolean;
  api_key: string;
  description: string;
  integration_type: string;
  esp_name: string;
}

export interface IPostalAccount {
  id: string;
  new?: boolean;
  api_key: string;
  description: string;
  integration_type: string;
  esp_name: string;
}

export interface ISendgridAccount {
  id: string;
  new?: boolean;
  sub_user_api_key: string;
  parent_api_key: string;
  sub_user_name: string;
  description: string;
  integration_type: string;
  esp_name: string;
  ip_pools: string[];
}

export interface ISeedList {
  id: string;
  new?: boolean;
  name: string;
  description: string;
  members: string[];
  disabled?: boolean;
}

export interface IAnedotAccount {
  id: string;
  new?: boolean;
  token: string;
}

export interface IIntegrations {
  mailgun: IMailgunAccount[];
  postal: IPostalAccount[];
  sendgrid: ISendgridAccount[];
  seed_list: ISeedList[];
  anedot: IAnedotAccount[];
}
