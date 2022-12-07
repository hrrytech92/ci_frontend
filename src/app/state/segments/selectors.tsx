import { IRedux } from 'app/definitions/redux';
import { getOrgUrl } from 'app/state/organizations/selectors';
import { omit, values, has, get, merge } from 'lodash';

const getSegments = (state: IRedux) => state.segments.byId;
export const getListSegmentsMeta = (state: IRedux) => state.segments.meta;

export const getListSegments = (state: IRedux, listId: number) => {
  return values(getSegments(state))
    .reverse()
    .filter(s => !s.disabled)
    .filter(s => s.list === listId);
};

export const getSegmentOptions = (state: IRedux, listId: number) => {
  return values(getListSegments(state, listId)).map(segment => {
    return { key: segment.id, text: segment.name, value: segment.id };
  });
};

const formFormatSegmentFilterEvents = segment => {
  const eventFiltersInclude = get(segment, 'filter.event.include', []);
  const eventFiltersExclude = get(segment, 'filter.event.exclude', []);

  const eventFilter = {
    messages: {
      clicked: {
        include: eventFiltersInclude.filter(
          f => has(f, 'message_id') && f.event_type === 'clicked',
        ),
        exclude: eventFiltersExclude.filter(
          f => has(f, 'message_id') && f.event_type === 'clicked',
        ),
      },
      opened: {
        include: eventFiltersInclude.filter(
          f => has(f, 'message_id') && f.event_type === 'opened',
        ),
        exclude: eventFiltersExclude.filter(
          f => has(f, 'message_id') && f.event_type === 'opened',
        ),
      },
    },
    campaigns: {
      clicked: {
        include: eventFiltersInclude.filter(
          f => has(f, 'campaign_id') && f.event_type === 'clicked',
        ),
        exclude: eventFiltersExclude.filter(
          f => has(f, 'campaign_id') && f.event_type === 'clicked',
        ),
      },
      opened: {
        include: eventFiltersInclude.filter(
          f => has(f, 'campaign_id') && f.event_type === 'opened',
        ),
        exclude: eventFiltersExclude.filter(
          f => has(f, 'campaign_id') && f.event_type === 'opened',
        ),
      },
    },
  };

  return merge(omit(segment, 'filter.event'), { filter: { event: eventFilter } });
};

export const getSegment = (state: IRedux, id?: number) => {
  return formFormatSegmentFilterEvents(getSegments(state)[id]);
};

export const getSegmentUrl = (state: IRedux, segmentId: number) => {
  const segment = getSegment(state, segmentId);
  if (segment) {
    return `${getOrgUrl(state)}lists/${segment.list}/segments/${segmentId}`;
  }
  return '';
};

export const getSegmentMembers = (state: IRedux, segmentId: number) => {
  return values(state.segmentMembers.byId).reverse();
};
export const getSegmentMembersMeta = (state: IRedux) => {
  return state.segmentMembers.meta;
};

const ignoredSubscriberFieldNames = ['validation_status', 'validation_sub_status', 'custom_data'];
export const getSubscriberSegmentFields = (state: IRedux) =>
  omit(state.segmentMeta.fields.subscriber, ignoredSubscriberFieldNames);

export const getListActivtySegmentFields = (state: IRedux) =>
  state.segmentMeta.fields.list_activity;

export const getSegmentFieldMeta = (state: IRedux) => state.segmentMeta.fieldMeta;
