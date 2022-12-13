export interface ICampaign {
  id: number;
  url: string;
  org: string;
  name: string;
  disabled: boolean;
  client: string;
  created_on: string | null;
}
