import { IPaginatedMeta } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IRedux } from 'app/definitions/redux';
import { formatDateTime } from 'app/helpers/date';
import { createList, fetchLists } from 'app/state/lists/api';
import { getListsForCurrentOrg, getListsMeta } from 'app/state/lists/selectors';
import AddList from 'app/views/lists/AddList';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Button, Label } from 'semantic-ui-react';
import { isNull } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  lists?: IList[];
  listsMeta: IPaginatedMeta;
  createList(IList): void;
  fetchLists: typeof fetchLists;
}

interface IState {
  activeTab: string;
}

class Lists extends React.Component<IProps, IState> {
  state = {
    activeTab: 'active',
  };

  componentDidMount() {
    this.props.fetchLists();
  }

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  loadMore = () => {
    this.props.fetchLists(this.props.listsMeta.next);
  };
  get disabled() {
    return this.props.lists.filter(c => c.disabled).length;
  }

  get active() {
    return this.props.lists.filter(c => !c.disabled).length;
  }
  render() {
    const { match, history, lists, listsMeta } = this.props;
    const { activeTab } = this.state;
    const filteredLists = lists.filter(c => c.disabled === (activeTab === 'disabled'));
    const showMore = !isNull(listsMeta.next);
    return (
      <>
        <Header as="h2">Lists</Header>
        <Menu secondary>
          <Menu.Item
            name="active"
            style={{ marginLeft: 0 }}
            active={activeTab === 'active'}
            onClick={this.handleTabClick}
          >
            Active <Label>{this.active}</Label>
          </Menu.Item>
          <Menu.Item
            name="disabled"
            active={activeTab === 'disabled'}
            onClick={this.handleTabClick}
          >
            Disabled <Label>{this.disabled}</Label>
          </Menu.Item>
          <Menu.Item position="right">
            <AddList onSubmit={this.props.createList} />
          </Menu.Item>
        </Menu>

        <Table selectable className="bootstrapTableFix" data-test="listsTable" basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Primary</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredLists.map(list => {
              return (
                <Table.Row key={list.id} onClick={() => history.push(`${match.url}/${list.id}`)}>
                  <Table.Cell>{list.id}</Table.Cell>
                  <Table.Cell>{list.list_name}</Table.Cell>
                  <Table.Cell>{list.description}</Table.Cell>
                  <Table.Cell>{formatDateTime(list.created_on)}</Table.Cell>
                  <Table.Cell>{list.primary ? 'Yes' : ''}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMore && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button onClick={this.loadMore} fluid content="Load More" />
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  lists: getListsForCurrentOrg(state),
  listsMeta: getListsMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    fetchLists,
    createList,
  },
)(Lists);
