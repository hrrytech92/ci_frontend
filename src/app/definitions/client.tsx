export interface IClient {
  id: number;
  name: string;
  short_name: string;
  description: string;
  is_active: boolean;
  created_on?: string | null;
  updated_on?: string | null;
}
