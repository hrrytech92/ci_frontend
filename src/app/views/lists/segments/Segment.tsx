import { IPaginatedMeta } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ISegment } from 'app/definitions/segment';
import { ISubscriber } from 'app/definitions/subscriber';
import { getListOptions, getListsForCurrentOrg, getListsUrl } from 'app/state/lists/selectors';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import {
  addListSegment,
  deleteListSegment,
  editListSegment,
  exportSegmentMembersToList,
  fetchListSegmentMembers,
  fetchListSegments,
  getSegmentMeta,
} from 'app/state/segments/api';
import {
  getSegment,
  getSegmentMembers,
  getSegmentMembersMeta,
} from 'app/state/segments/selectors';
import { thunkSetSegment } from 'app/state/thunk';
import EditSegmentForm from 'app/views/lists/segments/EditSegmentForm';
import SegmentMembers from 'app/views/lists/segments/SegmentMembers';
import { isUndefined, parseInt, isNull, concat, get, merge, omit } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Dropdown, DropdownItemProps, Header, Menu } from 'semantic-ui-react';
import { isObject } from 'util';

interface IMatch {
  segmentId: string;
  listId: string;
}

interface StateProps {
  members: ISubscriber[];
  segmentMembersMeta: IPaginatedMeta;
  listOptions: DropdownItemProps[];
  organization?: IOrganization;
  lists?: IList[];
  segment?: ISegment;
  listsUrl: string;
}

interface DispatchProps {
  deleteListSegment: typeof deleteListSegment;
  editListSegment: typeof editListSegment;
  addListSegment: typeof addListSegment;
  fetchListSegments: typeof fetchListSegments;
  getSegmentMeta: typeof getSegmentMeta;
  exportSegmentMembersToList?: typeof exportSegmentMembersToList;
  fetchListSegmentMembers: typeof fetchListSegmentMembers;
  thunkSetSegment: typeof thunkSetSegment;
}

interface OwnProps extends RouteComponentProps<IMatch> {}

interface IState {
  editing: boolean;
}
const combineEventFilters = segment => {
  const eventInclude = concat(
    get(segment, 'filter.event.messages.clicked.include', []),
    get(segment, 'filter.event.messages.opened.include', []),
    get(segment, 'filter.event.campaigns.clicked.include', []),
    get(segment, 'filter.event.campaigns.opened.include', []),
  ).filter(v => isObject(v));
  const eventExclude = concat(
    get(segment, 'filter.event.messages.clicked.exclude', []),
    get(segment, 'filter.event.messages.opened.exclude', []),
    get(segment, 'filter.event.campaigns.clicked.exclude', []),
    get(segment, 'filter.event.campaigns.opened.exclude', []),
  ).filter(v => isObject(v));
  return merge(omit(segment, 'filter.event'), {
    filter: { event: { include: eventInclude, exclude: eventExclude } },
  });
};

class Segment extends React.Component<OwnProps & StateProps & DispatchProps, IState> {
  state: IState = {
    editing: false,
  };

  componentDidMount() {
    const { segmentId, listId } = this.props.match.params;
    this.props.getSegmentMeta();
    this.props.fetchListSegments(parseInt(listId));

    if (segmentId !== 'new' && !isUndefined(segmentId)) {
      this.props.thunkSetSegment(parseInt(listId), parseInt(segmentId));
      this.props.fetchListSegmentMembers(parseInt(listId), parseInt(segmentId), '');
    }
  }

  navigateToSegment = (id?: number) => {
    const { listId } = this.props.match.params;
    if (id) {
      this.props.history.replace(
        `/org/${this.props.organization.id}/lists/${listId}/segments/${id}`,
      );
    } else {
      this.props.history.replace(`/org/${this.props.organization.id}/lists/${listId}/segments/`);
    }
  };
  loadMore = () => {
    this.props.fetchListSegmentMembers(null, null, this.props.segmentMembersMeta.next);
  };

  submit = values => {
    const segmentId = values.id;
    const { listId } = this.props.match.params;
    const fixedValues = combineEventFilters(values);
    if (this.isNew()) {
      // @ts-ignore
      this.props.addListSegment(parseInt(listId), fixedValues).then(({ id }) => {
        this.setState({ editing: false });
        this.navigateToSegment(id);
      });
    } else {
      // @ts-ignore
      this.props.editListSegment(parseInt(listId), segmentId, fixedValues).then(response => {
        if (response.id) {
          this.props.fetchListSegmentMembers(parseInt(listId), segmentId, '');
          this.setState({ editing: false });
        }
      });
    }
  };

  export = (e, { value }) => {
    const { listId, segmentId } = this.props.match.params;
    this.props.exportSegmentMembersToList(parseInt(listId), parseInt(segmentId), value);
  };

  handleCancel = () => {
    if (this.isNew()) {
      this.props.history.replace(this.props.listsUrl);
    } else {
      this.setState({ editing: false });
    }
  };

  isNew = () => {
    if (this.props.match.params.segmentId === 'new') {
      return true;
    }

    return false;
  };

  delete = () => {
    const c = confirm('Delete this segment?');

    if (c) {
      const { listId, segmentId } = this.props.match.params;
      this.props.deleteListSegment(listId, segmentId);
      this.props.history.replace(this.props.listsUrl);
    }
  };

  render() {
    const { editing } = this.state;
    const {
      match: {
        params: { listId },
      },
    } = this.props;
    let { segment, members, segmentMembersMeta } = this.props;
    const showMore = !isNull(segmentMembersMeta.next);

    if (!segment) {
      segment = {
        filter: {} as any,
      } as ISegment;
    }

    if (this.isNew() || editing) {
      return (
        <EditSegmentForm
          initialValues={segment}
          handleCancel={this.handleCancel}
          listId={parseInt(listId)}
          onSubmit={this.submit}
        />
      );
    }

    const isEditable = !segment.is_default;

    return (
      <>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Header as="h3">
              {segment.name}
              <Header.Subheader>Membership count {segment.estimated_recipients}</Header.Subheader>
            </Header>
          </Menu.Item>
          <Menu.Item position="right">
            <Dropdown
              selectOnNavigation={false}
              selectOnBlur={false}
              text="Export to list"
              onChange={this.export}
              button
              options={this.props.listOptions}
            />
            &nbsp;
            <Button disabled={!isEditable} content="Delete" color="red" onClick={this.delete} />
            &nbsp;
            <Button
              disabled={!isEditable}
              content="Edit"
              onClick={() => this.setState({ editing: true })}
              color="green"
            />
          </Menu.Item>
        </Menu>

        {segment && (
          <SegmentMembers
            members={members}
            push={this.props.history.push}
            orgId={this.props.organization.id}
            showMore={showMore}
            loadMore={this.loadMore}
          />
        )}
      </>
    );
  }
}

export default connect<StateProps, DispatchProps>(
  (state: IRedux, ownProps: OwnProps): StateProps => ({
    organization: getActiveOrganization(state),
    lists: getListsForCurrentOrg(state),
    segment: getSegment(state, parseInt(ownProps.match.params.segmentId)),
    listsUrl: getListsUrl(state),
    members: getSegmentMembers(state, parseInt(ownProps.match.params.segmentId)),
    segmentMembersMeta: getSegmentMembersMeta(state),
    listOptions: getListOptions(state),
  }),
  {
    editListSegment,
    addListSegment,
    getSegmentMeta,
    fetchListSegmentMembers,
    fetchListSegments,
    deleteListSegment,
    exportSegmentMembersToList,
    thunkSetSegment,
  },
)(Segment);
