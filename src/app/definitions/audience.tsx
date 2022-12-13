export interface IAudience {
  id: number;
  list: number;
  members: string;
  name: string;
  description: string;
  url: string;
  created_on: string | null;
  updated_on: string | null;
  members_count: number | null;
  disabled?: boolean;
}

export interface IAudienceMember {
  id: string;
  audience_id: number;
  subscriber_id: string;
  created_on: string | null;
  updated_on: string | null;
}

export interface IAudienceImport {
  id: string;
  org: string;
  audience: number;
  original_name?: string;
  s3_key?: string;
  created_on?: string | null;
  updated_on?: string | null;
  uploaded?: boolean;
  size?: number;
  import_status?: string;
}
