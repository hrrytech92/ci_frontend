export interface ISegmentStringFieldFilter {
  operator: string;
  value: string;
  negate: boolean;
}

export interface ISegmentIntegerFieldFilter {
  operator: string;
  value: number;
  negate: boolean;
}

export interface ISegmentCustomDataFieldFilter {
  operator: string;
  value: string;
  negate: boolean;
  field: string;
}

export interface ISegmentSubscriberFilter {
  email: ISegmentStringFieldFilter[];
  city: ISegmentStringFieldFilter[];
  state: ISegmentStringFieldFilter[];
  zip_code: ISegmentStringFieldFilter[];
  gender: ISegmentStringFieldFilter[];
  dob_y: ISegmentIntegerFieldFilter[];
  dob_m: ISegmentIntegerFieldFilter[];
  sources: ISegmentStringFieldFilter[];
  interests: ISegmentStringFieldFilter[];
  ci_segment: ISegmentStringFieldFilter[];
  created_on: ISegmentStringFieldFilter[];
  last_click: ISegmentStringFieldFilter[];
  last_open: ISegmentStringFieldFilter[];
  last_email: ISegmentStringFieldFilter[];
  validation_status: ISegmentStringFieldFilter[];
  validation_sub_status: ISegmentStringFieldFilter[];
  custom_data: ISegmentCustomDataFieldFilter[];
}

export interface ISegmentFilter {
  subscriber: ISegmentSubscriberFilter;
  list_activity: {
    last_click: {};
    last_open: {};
    last_activity: {};
  };
  segment_membership: {};
  messages_received: {};
  list_membership: {
    include: {}[];
    exclude: {}[];
  };
  event: {
    include: [];
    exclude: [];
  };
}

export interface ISegment {
  estimated_recipients: number | null;
  filter: ISegmentFilter;
  id: number;
  is_default: boolean;
  limit: number;
  list: number;
  members: string;
  name: string;
  subscription_status: number;
  url: string;
  disabled: boolean;
}

export interface ISegmentMetaRedux {
  fields: any;
  fieldMeta: any;
}
