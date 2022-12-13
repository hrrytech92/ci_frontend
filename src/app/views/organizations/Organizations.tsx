import { NormalizedResults } from 'app/definitions/api';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { addOrg } from 'app/state/organizations/api';
import { getOrganizations } from 'app/state/organizations/selectors';
import { values } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Icon, Menu, Table } from 'semantic-ui-react';
import AddOrganization from './AddOrganization';

interface IProps extends RouteComponentProps<void> {
  organizations: NormalizedResults<IOrganization>;
  getOrganizations: (params) => IOrganization[];
  addOrg(): void;
}

class Organizations extends React.Component<IProps> {
  render() {
    const { history, organizations } = this.props;

    return (
      <>
        <Header as="h2">Organizations</Header>
        <Menu secondary>
          <Menu.Item position="right">
            <AddOrganization onSubmit={this.props.addOrg} />
          </Menu.Item>
        </Menu>

        <Table selectable className="bootstrapTableFix" basic="very" data-test="campaignsTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Account Name</Table.HeaderCell>
              <Table.HeaderCell width="3" textAlign="right">
                In Bitfrost?
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {values(organizations).map(org => {
              return (
                <Table.Row key={org.id} onClick={() => history.push(`/organizations/${org.id}`)}>
                  <Table.Cell>{org.account_name}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {org.bitfrost && <Icon name="check" />}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  organizations: getOrganizations(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  { addOrg },
)(Organizations);
