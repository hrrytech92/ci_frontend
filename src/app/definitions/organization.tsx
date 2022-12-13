import { IIntegrations } from './integrations';
import { ITag } from './tag';

export interface IOrganization {
  id: string;
  account_name: string;
  domains: string;
  lists: string;
  subscribers: string;
  teams: any[];
  tags: ITag[];
  users: string;
  variables: object;
  integrations: IIntegrations;
  bitfrost: boolean;
  bitfrost_tokens: {
    orgId: string;
    tokens: any[];
  };
}
