import Form from 'app/base-classes/form/Form';
import { NormalizedResults } from 'app/definitions/api';
import { IPaginatedMeta } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IMember } from 'app/definitions/member';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ISegment } from 'app/definitions/segment';
import { IAudience } from 'app/definitions/audience';
import { formatDate } from 'app/helpers/date';
import { deleteList, editList, enableList, fetchList } from 'app/state/lists/api';
import { getList, getListMembers, getListMembersMeta } from 'app/state/lists/selectors';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { fetchListSegments, cloneListSegment } from 'app/state/segments/api';
import { fetchAudiences, addAudience, deleteAudience } from 'app/state/audiences/api';
import { getListAudiences, getAudiencesMeta } from 'app/state/audiences/selectors';
import { getListSegments, getListSegmentsMeta } from 'app/state/segments/selectors';
import { fetchListMembers, searchListMembers } from 'app/state/subscribers/api';
import EditableHeader from 'app/views/lists/EditableHeader';
import { isEmpty, values } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Menu, Search, Table } from 'semantic-ui-react';
import './list.scss';
import { isNull } from 'util';
import AddAudience from './audiences/AddAudience';

interface IMatch {
  listId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  fetchListMembers: (d?, e?) => IMember[];
  searchListMembers: (a, b) => IMember[];
  fetchListSegments: (a, b?) => ISegment[];
  fetchAudiences: (a, b?) => IAudience[];
  deleteAudience: (a, b) => void;
  cloneListSegment: (a, b?) => ISegment;
  deleteList: (d) => void;
  fetchList(listId: string): void;
  updateList: (a, b) => void;
  enableList: (a) => void;
  addAudience: typeof addAudience;
  list: IList;
  listMembers?: IMember[];
  listSegments?: NormalizedResults<ISegment>;
  listMembersMeta: IPaginatedMeta;
  listSegmentsMeta: IPaginatedMeta;
  audiences?: NormalizedResults<IAudience>;
  audiencesMeta: IPaginatedMeta;
  organization?: IOrganization;
}

interface IState {
  activeTab: string;
}

class List extends Form<IProps, IState> {
  state: IState = {
    activeTab: 'members',
  };

  componentDidMount() {
    const listId = this.props.match.params.listId;
    this.props.fetchList(listId);
    this.props.fetchListMembers(listId);
    this.props.fetchListSegments(listId);
    this.props.fetchAudiences(listId);
  }

  edit = list => {
    this.props.updateList(this.props.list.id, list);
  };

  delete = async () => {
    const c = confirm('Delete this list?');
    if (c) {
      await this.props.deleteList(this.props.match.params.listId);
      this.props.history.replace('/org/lists');
    }
  };

  handleSearch = (e, { value }) => {
    const listId = this.props.match.params.listId;
    if (!!value) {
      this.props.searchListMembers(listId, value);
    } else {
      this.props.fetchListMembers(listId);
    }
  };

  toggleDisable = async () => {
    const { list } = this.props;
    const isDisabled = list.disabled;
    const c = confirm(`${isDisabled ? 'Enable' : 'Disable'} this List?`);
    if (c) {
      if (!isDisabled) {
        await this.props.deleteList(list.id);
      } else {
        await this.props.enableList(list.id);
      }
    }
  };

  loadMoreListMembers = () => {
    this.props.fetchListMembers(false, this.props.listMembersMeta.next);
  };
  loadMoreListSegments = () => {
    this.props.fetchListSegments(false, this.props.listSegmentsMeta.next);
  };
  loadMoreAudiences = () => {
    this.props.fetchAudiences(false, this.props.audiencesMeta.next);
  };
  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  render() {
    const {
      list,
      listMembers,
      listMembersMeta,
      listSegments,
      listSegmentsMeta,
      audiences,
      audiencesMeta,
      match,
      history,
      organization,
      cloneListSegment,
      deleteAudience,
    } = this.props;
    const { activeTab } = this.state;
    const showMoreListMembers = !isNull(listMembersMeta.next);
    const showMoreListSegments = !isNull(listSegmentsMeta.next);
    const showMoreAudiences = !isNull(audiencesMeta.next);
    showMoreAudiences;
    audiences;
    if (!list) {
      return null;
    }
    return (
      <>
        {!isEmpty(list) && (
          <EditableHeader
            onSubmit={this.edit}
            toggleDisable={this.toggleDisable}
            disabled={list.disabled}
            list={list}
          />
        )}

        <p className="small">
          Created At: {formatDate(list.created_on)}
          <br />
          Last Updated: {formatDate(list.updated_on)}
          <br />
          Member Count: {listMembersMeta.count}
        </p>

        <Menu secondary>
          <Menu.Item
            name="members"
            active={activeTab === 'members'}
            onClick={this.handleTabClick}
          />
          <Menu.Item
            name="segments"
            active={activeTab === 'segments'}
            onClick={this.handleTabClick}
          />
          <Menu.Item
            name="audiences"
            active={activeTab === 'audiences'}
            onClick={this.handleTabClick}
          />
          {activeTab === 'segments' && (
            <Menu.Item position="right">
              <Button
                color="green"
                icon="plus"
                content="New Segment"
                onClick={() => history.push(`${match.url}/segments/new`)}
              />
            </Menu.Item>
          )}

          {activeTab === 'audiences' && (
            <Menu.Item position="right">
              <AddAudience onSubmit={this.props.addAudience} listId={list.id} />
            </Menu.Item>
          )}
        </Menu>

        {activeTab === 'members' && (
          <>
            <Search
              placeholder="Search"
              loading={false}
              resultRenderer={null}
              showNoResults={false}
              onSearchChange={this.handleSearch}
            />
            <Table selectable className="bootstrapTableFix" basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Subscribed</Table.HeaderCell>
                  <Table.HeaderCell>Subscribe Date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {listMembers.map((member, i) => {
                  return (
                    <Table.Row
                      key={i}
                      onClick={() =>
                        history.push(`/org/${organization.id}/subscribers/${member.subscriber.id}`)
                      }
                    >
                      <Table.Cell>{member.subscriber.email}</Table.Cell>
                      <Table.Cell>{member.status_display}</Table.Cell>
                      <Table.Cell>{member.subscribe_date}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              {showMoreListMembers && (
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Button onClick={this.loadMoreListMembers} fluid content="Load More" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          </>
        )}

        {activeTab === 'segments' && (
          <Table selectable className="bootstrapTableFix" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {values(listSegments).map((segment, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell
                      onClick={() => history.push(`${match.url}/segments/${segment.id}`)}
                    >
                      {segment.id}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => history.push(`${match.url}/segments/${segment.id}`)}
                    >
                      {segment.name}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="green"
                        onClick={e => {
                          e.preventDefault();
                          cloneListSegment(list.id, segment.id);
                        }}
                      >
                        Clone
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            {showMoreListSegments && (
              <Table.Footer>
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Button onClick={this.loadMoreListSegments} fluid content="Load More" />
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            )}
          </Table>
        )}

        {activeTab === 'audiences' && (
          <Table selectable className="bootstrapTableFix" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>Updated</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {values(audiences).map((audience, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell
                      onClick={() => history.push(`${match.url}/audiences/${audience.id}`)}
                    >
                      {audience.id}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => history.push(`${match.url}/audiences/${audience.id}`)}
                    >
                      {audience.name}
                    </Table.Cell>
                    <Table.Cell>{formatDate(audience.created_on)}</Table.Cell>
                    <Table.Cell>{formatDate(audience.updated_on)}</Table.Cell>
                    <Table.Cell>
                      <Button
                        color="red"
                        onClick={e => {
                          e.preventDefault();
                          console.log('delete');
                          deleteAudience(list.id, audience.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            {showMoreAudiences && (
              <Table.Footer>
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Button onClick={this.loadMoreAudiences} fluid content="Load More" />
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            )}
          </Table>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    list: getList(state, parseInt(ownProps.match.params.listId)),
    listMembers: getListMembers(state),
    listMembersMeta: getListMembersMeta(state),
    listSegments: getListSegments(state, parseInt(ownProps.match.params.listId)),
    listSegmentsMeta: getListSegmentsMeta(state),
    audiences: getListAudiences(state, parseInt(ownProps.match.params.listId)),
    audiencesMeta: getAudiencesMeta(state),
    organization: getActiveOrganization(state),
  }),
  {
    fetchListMembers,
    fetchList,
    fetchListSegments,
    fetchAudiences,
    addAudience,
    deleteAudience,
    updateList: editList,
    deleteList,
    searchListMembers,
    enableList,
    cloneListSegment,
  },
)(List);
