import Form from 'app/base-classes/form/Form';
import { IPaginatedMeta } from 'app/definitions/api';
import { ISuppressionList, ISuppressedEmail } from 'app/definitions/suppressionList';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { formatDate } from 'app/helpers/date';
import {
  saveSuppressionList,
  fetchSuppressionListMembers,
  searchSuppressionListMembers,
  addSuppressionListMember,
  fetchSuppressionList,
  deleteSuppressionListMember,
} from 'app/state/suppression-lists/api';
import {
  getSuppressionList,
  getSuppressionListMembers,
  getSuppressionListMembersMeta,
} from 'app/state/suppression-lists/selectors';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import EditableHeader from 'app/views/suppression_lists/EditableHeader';
import AddSuppressedEmail from 'app/views/suppression_lists/AddSuppressedEmail';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Table, Button, Menu, Search } from 'semantic-ui-react';
import { isNull } from 'util';

interface IMatch {
  suppressionListId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  fetchSuppressionListMembers: (d?, e?) => ISuppressedEmail[];
  searchSuppressionListMembers: (d?, e?) => ISuppressedEmail[];
  fetchSuppressionList: (d?) => void;
  updateSuppressionList: (a) => void;
  deleteSuppressionListMember: typeof deleteSuppressionListMember;
  saveSuppressionListMember: typeof addSuppressionListMember;
  suppressionList: ISuppressionList;
  suppressionListMembers: ISuppressedEmail[];
  suppressionListMembersMeta: IPaginatedMeta;
  organization?: IOrganization;
}

class SuppressionList extends Form<IProps> {
  componentDidMount() {
    this.props.fetchSuppressionListMembers(this.props.match.params.suppressionListId);
    this.props.fetchSuppressionList(this.props.match.params.suppressionListId);
  }

  edit = suppressionList => {
    suppressionList['id'] = this.props.suppressionList.id;
    this.props.updateSuppressionList(suppressionList);
  };

  handleSearch = (e, { value }) => {
    const suppressionListId = this.props.match.params.suppressionListId;
    if (!!value) {
      this.props.searchSuppressionListMembers(suppressionListId, value);
    } else {
      this.props.fetchSuppressionListMembers(suppressionListId);
    }
  };

  loadMoreSuppressionListMembers = () => {
    this.props.fetchSuppressionListMembers(false, this.props.suppressionListMembersMeta.next);
  };

  addSuppressedEmail = email => {
    this.props.saveSuppressionListMember(this.props.match.params.suppressionListId, email);
  };

  render() {
    const {
      suppressionList,
      suppressionListMembers,
      suppressionListMembersMeta,
      deleteSuppressionListMember,
    } = this.props;
    const showMoreSuppressionListMembers = !isNull(suppressionListMembersMeta.next);
    if (!suppressionList) {
      return null;
    }
    return (
      <>
        {!isEmpty(suppressionList) && (
          <EditableHeader onSubmit={this.edit} suppressionList={suppressionList} />
        )}

        <p className="small">
          Created At: {formatDate(suppressionList.created_on)}
          <br />
          Last Updated: {formatDate(suppressionList.updated_on)}
          <br />
          Member Count: {suppressionListMembersMeta.count}
        </p>
        <Menu secondary>
          <Menu.Item position="right">
            <AddSuppressedEmail onSubmit={this.addSuppressedEmail} />
          </Menu.Item>
        </Menu>
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
              <Table.HeaderCell>Added On</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {suppressionListMembers.map((member, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell>{member.email}</Table.Cell>
                  <Table.Cell>{member.created_on}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="red"
                      onClick={() => {
                        deleteSuppressionListMember(suppressionList.id, member.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMoreSuppressionListMembers && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button
                    onClick={this.loadMoreSuppressionListMembers}
                    fluid
                    content="Load More"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    suppressionList: getSuppressionList(state, parseInt(ownProps.match.params.suppressionListId)),
    suppressionListMembers: getSuppressionListMembers(
      state,
      parseInt(ownProps.match.params.suppressionListId),
    ),
    suppressionListMembersMeta: getSuppressionListMembersMeta(state),
    organization: getActiveOrganization(state),
  }),
  {
    updateSuppressionList: saveSuppressionList,
    fetchSuppressionListMembers,
    searchSuppressionListMembers,
    fetchSuppressionList,
    deleteSuppressionListMember,
    saveSuppressionListMember: addSuppressionListMember,
  },
)(SuppressionList);
