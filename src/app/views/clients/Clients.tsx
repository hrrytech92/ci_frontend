import { IPaginatedMeta } from 'app/definitions/api';
import { IClient } from 'app/definitions/client';
import { IRedux } from 'app/definitions/redux';
import { getClientsForCurrentOrg, getClientsMeta } from 'app/state/clients/selectors';
import { createClient, fetchClients } from 'app/state/clients/api';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Menu, Table } from 'semantic-ui-react';
import { isNull } from 'lodash';
import AddClient from './AddClient';

interface IProps extends RouteComponentProps<void> {
  clients?: IClient[];
  clientsMeta: IPaginatedMeta;
  createClient(IClient): void;
  fetchClients: typeof fetchClients;
}

const Clients: React.FunctionComponent<IProps> = ({
  match,
  history,
  clients,
  clientsMeta,
  createClient,
  fetchClients,
}) => {
  React.useEffect(() => {
    fetchClients();
  }, []);

  const loadMore = () => {
    fetchClients(clientsMeta.next);
  };

  const showMore = !isNull(clientsMeta.next);

  return (
    <>
      <Header as="h2">Clients</Header>
      <Menu secondary>
        <Menu.Item position="right">
          <AddClient onSubmit={createClient} />
        </Menu.Item>
      </Menu>
      <Table basic="very" className="bootstrapTableFix">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Short Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Active</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clients.map(client => (
            <Table.Row key={client.id} onClick={() => history.push(`${match.url}/${client.id}`)}>
              <Table.Cell>{client.name}</Table.Cell>
              <Table.Cell>{client.short_name}</Table.Cell>
              <Table.Cell>{client.description}</Table.Cell>
              <Table.Cell>{client.is_active.toString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        {showMore && (
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Button onClick={loadMore} fluid content="Load More" />
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
};

const mapStateToProps = (state: IRedux) => ({
  clients: getClientsForCurrentOrg(state),
  clientsMeta: getClientsMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    fetchClients,
    createClient,
  },
)(Clients);
