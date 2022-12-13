export interface ISuppressionList {
  id: string;
  new?: boolean;
  name: string;
  org: string;
  description: string;
  created_on: string | null;
  updated_on: string | null;
}

export interface ISuppressedEmail {
  id: string;
  suppression_list_id: number;
  email: string;
  created_on: string | null;
  updated_on: string | null;
}

export interface ISuppressionListImport {
  id: string;
  org: string;
  suppression_lists: number[];
  original_name?: string;
  s3_key?: string;
  created_on?: string | null;
  updated_on?: string | null;
  uploaded?: boolean;
  size?: number;
  import_status?: string;
}
