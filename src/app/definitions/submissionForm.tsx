export interface ISubmissionForm {
  id: number;
  name: string;
  org: string;
  key: string;
  created_at: string | null;
  updated_at: string | null;
  list_subscription: number;
  send_email?: boolean;
  welcome_message?: number;
  allowed_fields?: string[];
}

export interface IWelcomeMessage {
  id: number;
  name: string;
  org: string;
  created_at: string | null;
  updated_at: string | null;
  sender_name: string;
  sender_email: string;
  subject: string;
  domain: number;
  template: number;
  variables?: any[];
}
