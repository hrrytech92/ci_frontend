import { ISuppressionList, ISuppressionListImport } from 'app/definitions/suppressionList';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { formatDateTime } from 'app/helpers/date';
import {
  saveSuppressionList,
  fetchSuppressionLists,
  fetchSuppressionListImports,
  deleteSuppressionList,
} from 'app/state/suppression-lists/api';
import {
  getSuppressionLists,
  getSuppressionListsMeta,
  getSuppressionListImports,
  getSuppressionListImportsMeta,
} from 'app/state/suppression-lists/selectors';
import AddSuppressionList from 'app/views/suppression_lists/AddSuppressionList';
import BulkImport from 'app/views/suppression_lists/BulkImport';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Button, Modal } from 'semantic-ui-react';
import { isNull } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  suppressionLists?: ISuppressionList[];
  suppressionListsMeta: IPaginatedMeta;
  suppressionListImports?: ISuppressionListImport[];
  suppressionListImportsMeta: IPaginatedMeta;
  fetchSuppressionLists: typeof fetchSuppressionLists;
  fetchSuppressionListImports: typeof fetchSuppressionListImports;
  saveSuppressionList(ISuppressionList): void;
  deleteSuppressionList(ISuppressionListId): void;
}

interface IState {
  activeTab: string;
  modal: boolean;
}

class SuppressionLists extends React.Component<IProps, IState> {
  state: IState = {
    activeTab: 'suppressionLists',
    modal: false,
  };

  import = () => {
    this.setState({ modal: true });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  loadMoreSuppressionLists = () => {
    this.props.fetchSuppressionLists(this.props.suppressionListsMeta.next);
  };
  loadMoreSuppressionListImports = () => {
    this.props.fetchSuppressionListImports(this.props.suppressionListImportsMeta.next);
  };
  delete = async suppressionListId => {
    const c = confirm('Delete this Suppression List?');
    if (c) {
      await this.props.deleteSuppressionList(suppressionListId);
    }
  };
  render() {
    const {
      suppressionLists,
      suppressionListsMeta,
      match,
      history,
      suppressionListImports,
      suppressionListImportsMeta,
    } = this.props;
    const { activeTab, modal } = this.state;
    const showMoreSuppressionLists = !isNull(suppressionListsMeta.next);
    const showMoreSuppressionListImports = !isNull(suppressionListImportsMeta.next);

    return (
      <>
        <Header as="h2">Suppression Lists</Header>
        <Menu secondary>
          <Menu.Item
            name="suppressionLists"
            active={activeTab === 'suppressionLists'}
            onClick={this.handleTabClick}
          />
          <Menu.Item
            name="suppressionListImports"
            active={activeTab === 'suppressionListImports'}
            onClick={this.handleTabClick}
          />
          {activeTab === 'suppressionLists' && (
            <Menu.Item position="right">
              <AddSuppressionList onSubmit={this.props.saveSuppressionList} />
            </Menu.Item>
          )}
          {activeTab === 'suppressionListImports' && (
            <Menu.Item position="right">
              <Button color="green" onClick={this.import} content="Bulk Import" icon="file" />
            </Menu.Item>
          )}
        </Menu>
        {activeTab === 'suppressionLists' && (
          <>
            <Table selectable className="bootstrapTableFix" data-test="listsTable" basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Created At</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {suppressionLists.map(sl => {
                  return (
                    <Table.Row key={sl.id}>
                      <Table.Cell onClick={() => history.push(`${match.url}/${sl.id}`)}>
                        {sl.id}
                      </Table.Cell>
                      <Table.Cell onClick={() => history.push(`${match.url}/${sl.id}`)}>
                        {sl.name}
                      </Table.Cell>
                      <Table.Cell onClick={() => history.push(`${match.url}/${sl.id}`)}>
                        {sl.description}
                      </Table.Cell>
                      <Table.Cell onClick={() => history.push(`${match.url}/${sl.id}`)}>
                        {formatDateTime(sl.created_on)}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() => {
                            this.delete(sl.id);
                          }}
                          color="red"
                          icon="ban"
                          content="Delete"
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              {showMoreSuppressionLists && (
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Button onClick={this.loadMoreSuppressionLists} fluid content="Load More" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          </>
        )}
        {activeTab === 'suppressionListImports' && (
          <>
            <Table selectable className="bootstrapTableFix" data-test="listsTable" basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                  <Table.HeaderCell>Orignal Name</Table.HeaderCell>
                  <Table.HeaderCell>Import Status</Table.HeaderCell>
                  <Table.HeaderCell>Created At</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {suppressionListImports.map(sl => {
                  return (
                    <Table.Row key={sl.id}>
                      <Table.Cell>{sl.id}</Table.Cell>
                      <Table.Cell>{sl.original_name}</Table.Cell>
                      <Table.Cell>{sl.import_status}</Table.Cell>
                      <Table.Cell>{formatDateTime(sl.created_on)}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              {showMoreSuppressionListImports && (
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Button
                        onClick={this.loadMoreSuppressionListImports}
                        fluid
                        content="Load More"
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
            <Modal
              open={modal}
              onClose={this.toggle}
              toggle={this.toggle}
              className="bootstrapModalFix"
            >
              <Modal.Header toggle={this.toggle}>Import Suppressed Emails</Modal.Header>
              <Modal.Content>
                <BulkImport onSuccess={this.toggle} />
              </Modal.Content>
            </Modal>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  suppressionLists: getSuppressionLists(state),
  suppressionListsMeta: getSuppressionListsMeta(state),
  suppressionListImports: getSuppressionListImports(state),
  suppressionListImportsMeta: getSuppressionListImportsMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    saveSuppressionList,
    fetchSuppressionLists,
    fetchSuppressionListImports,
    deleteSuppressionList,
  },
)(SuppressionLists);
