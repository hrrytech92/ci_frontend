export interface IFileImport {
  user: {
    id: number;
    email: string;
    name: string;
  };
  org: string;
  lists: number[];
  original_name: string;
  s3_key: string;
  size: number;
  created_on: string;
  updated_on: string;
  validation_source: string;
  uploaded: boolean;
  import_status: string;
  import_summary: {
    num_new: number;
    num_rows: number;
    num_valid: number;
    list_stats: any;
    num_existing: number;
  };
}
