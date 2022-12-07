import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IRedux } from 'app/definitions/redux';
import { concat, get, uniq, has } from 'lodash';
import { fetchListSegment } from './segments/api';
import { fetchList } from './lists/api';
import { fetchCampaign } from './campaigns/api';
import { fetchMessage } from './messages/api';

export const thunkSetSegment = (
  listId: any,
  segmentId: any,
): ThunkAction<void, IRedux, null, Action<string>> => async dispatch => {
  const segment = await dispatch(fetchListSegment(listId, segmentId));

  const segmentIds = uniq(
    concat(
      get(segment, 'filter.segment_membership.include', []),
      get(segment, 'filter.segment_membership.exclude', []),
    ),
  );
  const messageReceivedIds = uniq(
    concat(
      get(segment, 'filter.messages_received.include', []),
      get(segment, 'filter.messages_received.exclude', []),
    ),
  );
  const listIds = uniq(
    concat(
      get(segment, 'filter.list_membership.include', []),
      get(segment, 'filter.list_membership.exclude', []),
    ).map(l => l.list_id),
  );

  const eventFilters = concat(
    get(segment, 'filter.event.include', []),
    get(segment, 'filter.event.exclude', []),
  );
  const campaignIds = uniq(
    eventFilters.filter(e => has(e, 'campaign_id')).map(e => get(e, 'campaign_id')),
  );
  const messageEventIds = uniq(
    eventFilters.filter(e => has(e, 'message_id')).map(e => get(e, 'message_id')),
  );

  const messageIds = uniq(concat(messageEventIds, messageReceivedIds));

  campaignIds.map(e => dispatch(fetchCampaign(e)));
  listIds.map(e => dispatch(fetchList(e)));
  messageIds.map(e => dispatch(fetchMessage(e)));
  segmentIds.map(e => dispatch(fetchListSegment(listId, e)));
};
