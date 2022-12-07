export interface IDomain {
  id: number;
  org: number;
  name: string;
  status: string;
  ip_pool: string;
  description: string;
  settings: {
    receiving_dns_records?: {
      valid: 'valid' | 'invalid';
      value: string;
      cached: string[];
      priority: string;
      record_type: string;
    }[];
    sending_dns_records?: {
      name: string;
      valid: string;
      value: string;
      cached: string[];
      record_type: string;
    }[];
    tracking?: {};
    webhooks: {};
  };
  esp: string;
  esp_account_id: number;
  disabled: boolean;
}
