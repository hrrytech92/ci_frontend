import { IBulkDonationImport } from 'app/definitions/payments';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { formatDateTime } from 'app/helpers/date';

import { fetchBulkDonationImports } from 'app/state/payments/api';
import { getBulkDonationImports, getBulkDonationImportsMeta } from 'app/state/payments/selectors';

import BulkImport from 'app/views/payments/BulkImport';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Button, Modal } from 'semantic-ui-react';
import { isNull } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  bulkDonationImports?: IBulkDonationImport[];
  bulkDonationImportsMeta: IPaginatedMeta;
  fetchBulkDonationImports: typeof fetchBulkDonationImports;
}

interface IState {
  modal: boolean;
}

class BulkDonationImports extends React.Component<IProps, IState> {
  state: IState = {
    modal: false,
  };

  import = () => {
    this.setState({ modal: true });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  loadMoreBulkDonationImports = () => {
    this.props.fetchBulkDonationImports(this.props.bulkDonationImportsMeta.next);
  };

  render() {
    const { bulkDonationImports, bulkDonationImportsMeta } = this.props;
    const { modal } = this.state;

    const showMoreBulkDonationImports = !isNull(bulkDonationImportsMeta.next);

    return (
      <>
        <Header as="h2">Bulk Donation Imports</Header>
        <Menu secondary>
          <Menu.Item position="right">
            <Button color="green" onClick={this.import} content="Bulk Import" icon="file" />
          </Menu.Item>
        </Menu>
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
            {bulkDonationImports.map(sl => {
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
          {showMoreBulkDonationImports && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button onClick={this.loadMoreBulkDonationImports} fluid content="Load More" />
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
          <Modal.Header toggle={this.toggle}>Import Bulk Donations</Modal.Header>
          <Modal.Content>
            <BulkImport onSuccess={this.toggle} />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  bulkDonationImports: getBulkDonationImports(state),
  bulkDonationImportsMeta: getBulkDonationImportsMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    fetchBulkDonationImports,
  },
)(BulkDonationImports);
