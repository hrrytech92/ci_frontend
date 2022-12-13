import { IRedux } from 'app/definitions/redux';
import { IOrgUser } from 'app/definitions/user';
import { getUsers } from 'app/state/users/selectors';
import * as React from 'react';
import { connect } from 'react-redux';
import { Header, Table } from 'semantic-ui-react';

interface IProps {
  users: IOrgUser[];
}

const Users: React.FunctionComponent<IProps> = ({ users }) => (
  <>
    <Header as="h2">Users</Header>
    <Table basic="very" className="bootstrapTableFix">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map(user => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </>
);

export default connect((state: IRedux) => ({
  users: getUsers(state),
}))(Users);
