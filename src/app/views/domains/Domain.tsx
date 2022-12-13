import { IDomain } from 'app/definitions/domain';
import { IRedux } from 'app/definitions/redux';
import { deleteDomain, verifyDomain } from 'app/state/domains/api';
import { getDomain } from 'app/state/domains/selectors';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Label, Menu, Table } from 'semantic-ui-react';

interface IMatch {
  domainId: number;
}

interface IProps extends RouteComponentProps<IMatch> {
  domain?: IDomain;
  getDomain?: (d) => IDomain;
  deleteDomain?: (d) => void;
  verifyDomain?: (a, b) => IDomain;
}

class Domain extends React.Component<IProps> {
  verify = async () => {
    const {
      domain: { id, name },
    } = this.props;
    await this.props.verifyDomain(id, { name });
  };

  delete = async () => {
    const c = confirm('Disable this domain?');
    if (c) {
      await this.props.deleteDomain(this.props.domain.id);
      this.props.history.replace('/org/domains');
    }
  };

  render() {
    if (!this.props.domain) {
      return null;
    }
    const {
      status,
      name,
      settings,
      esp,
      esp_account_id,
      description,
      ip_pool,
    } = this.props.domain;

    return (
      <div>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Header as="h3">
              {name} <Label color={status === 'unverified' ? 'red' : 'green'}>{status}</Label>
              <Header.Subheader>{description}</Header.Subheader>
            </Header>
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="red" icon="ban" content="Disable Domain" onClick={this.delete} />
            &nbsp;
            <Button onClick={this.verify} color="green" icon="check" content="Verify Domain" />
          </Menu.Item>
        </Menu>

        <Table definition celled collapsing compact>
          <Table.Body>
            <Table.Row>
              <Table.Cell>ESP</Table.Cell>
              <Table.Cell>
                {esp} - {esp_account_id}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>IP Pool</Table.Cell>
              <Table.Cell>{ip_pool}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {settings.sending_dns_records && (
          <>
            <Header as="h3">Sending DNS Records</Header>

            <Table basic="very" className="bootstrapTableFix">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Type</Table.HeaderCell>
                  <Table.HeaderCell width={6}>Hostname</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Valid</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {settings.sending_dns_records.map((setting, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{setting.record_type}</Table.Cell>
                    <Table.Cell>{setting.name}</Table.Cell>
                    <Table.Cell>{setting.valid}</Table.Cell>
                    <Table.Cell>
                      <code>{setting.value}</code>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {settings.receiving_dns_records && (
          <>
            <Header as="h3">Receiving DNS Records</Header>
            <Table basic="very" className="bootstrapTableFix">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Priority</Table.HeaderCell>
                  <Table.HeaderCell>Valid</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {settings.receiving_dns_records.map((setting, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{setting.record_type}</Table.Cell>
                    <Table.Cell>{setting.priority}</Table.Cell>
                    <Table.Cell>{setting.valid}</Table.Cell>
                    <Table.Cell>{setting.value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </div>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    domain: getDomain(state, ownProps.match.params.domainId),
  }),
  {
    verifyDomain,
    deleteDomain,
  },
)(Domain);
