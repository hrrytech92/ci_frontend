import Actions from 'app/actions/actions';
import { getOrgApiUrl } from 'app/actions/url';
import { ISegment } from 'app/definitions/segment';
import { ISubscriber } from 'app/definitions/subscriber';
import axios from 'app/helpers/axios';
import {
  deleteSegmentSuccess,
  fetchListSegmentMembersSuccess,
  fetchSegmentsSuccess,
  fetchSegmentSuccess,
  setSegmentMeta,
} from 'app/state/segments/actions';
import { omit } from 'lodash';

export const getSegmentMeta = () => (dispatch): Promise<any> => {
  return axios
    .get('/segment_info/')
    .then(({ data }) => {
      dispatch(setSegmentMeta(omit(data.fields, 'fields.limit'), data.fieldMeta));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};

export const fetchListSegments = (listId?: number, url?: string) => (
  dispatch,
): Promise<ISegment[]> => {
  const fetchUrl = url || getOrgApiUrl(`lists/${listId}/segments/?include_disabled=true`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchSegmentsSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchListSegment = (listId: number, segmentId: number) => (
  dispatch,
): Promise<ISegment> => {
  return axios
    .get(getOrgApiUrl(`lists/${listId}/segments/${segmentId}/?include_disabled=true`))
    .then(({ data }) => {
      dispatch(fetchSegmentSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const cloneListSegment = (listId: number, segmentId: number) => (
  dispatch,
): Promise<ISegment> => {
  return axios
    .put(getOrgApiUrl(`lists/${listId}/segments/${segmentId}/clone/?include_disabled=true`), {})
    .then(({ data }) => {
      dispatch(fetchSegmentSuccess(data));
      dispatch(Actions.showSuccess('Segment Cloned!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const deleteListSegment = (listId: string, segmentId: string) => (
  dispatch,
): Promise<ISegment> => {
  return axios
    .delete(getOrgApiUrl(`lists/${listId}/segments/${segmentId}/?include_disabled=true`), {})
    .then(({ data }) => {
      dispatch(deleteSegmentSuccess(segmentId));
      dispatch(Actions.showSuccess('Segment Deleted!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const fetchListSegmentMembers = (listId?: number, segmentId?: number, url?: string) => (
  dispatch,
): Promise<ISubscriber[]> => {
  const fetchUrl =
    url || getOrgApiUrl(`lists/${listId}/segments/${segmentId}/members/?include_disabled=true`);
  return axios
    .get(fetchUrl)
    .then(({ data }) => {
      dispatch(fetchListSegmentMembersSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const addListSegment = (listId: number, segment: ISegment) => (dispatch): Promise<void> => {
  return axios
    .post(getOrgApiUrl(`lists/${listId}/segments`), segment)
    .then(({ data }) => {
      dispatch(fetchSegmentSuccess(data));
      dispatch(Actions.showSuccess('Segment Created!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return Promise.reject(error);
    });
};
export const editListSegment = (listId: number, segmentId: number, segment: ISegment) => (
  dispatch,
): Promise<void> => {
  return axios
    .put(getOrgApiUrl(`lists/${listId}/segments/${segmentId}/?include_disabled=true`), segment)
    .then(({ data }) => {
      dispatch(fetchSegmentSuccess(data));
      dispatch(Actions.showSuccess('Segment Updated!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
export const exportSegmentMembersToList = (
  fromListId: number,
  fromSegmentId: number,
  toListId: number,
) => (dispatch): Promise<void> => {
  return axios
    .post(
      getOrgApiUrl(`lists/${fromListId}/segments/${fromSegmentId}/export`) + `?list=${toListId}`,
      {},
    )
    .then(({ data }) => {
      dispatch(Actions.showSuccess('Segment Export is Queued!'));
      return data;
    })
    .catch(error => {
      dispatch(Actions.showError(error));
      return error;
    });
};
