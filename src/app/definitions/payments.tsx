export interface IBulkDonationImport {
  id: string;
  org_id: string;
  payment_processor?: string;
  original_name?: string;
  s3_key?: string;
  created_on?: string | null;
  updated_on?: string | null;
  uploaded?: boolean;
  size?: number;
  import_status?: string;
}
