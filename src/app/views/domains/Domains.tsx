import { IPaginatedMeta } from 'app/definitions/api';
import { IDomain } from 'app/definitions/domain';
import { IRedux } from 'app/definitions/redux';
import { getDomainsForCurrentOrg, getDomainsMeta } from 'app/state/domains/selectors';
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchDomains } from 'app/state/domains/api';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Label, Button } from 'semantic-ui-react';
import AddDomain from './AddDomain';
import { isNull } from 'util';
import { values } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  domains?: IDomain[];
  domainsMeta: IPaginatedMeta;
  fetchDomains: typeof fetchDomains;
}

interface IState {
  activeTab: string;
}

class Domains extends React.Component<IProps> {
  state: IState = {
    activeTab: 'active',
  };

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  loadMore = () => {
    this.props.fetchDomains(this.props.domainsMeta.next);
  };

  get disabled() {
    return this.props.domains.filter(c => c.disabled).length;
  }

  get active() {
    return this.props.domains.filter(c => !c.disabled).length;
  }

  public render() {
    const { history, match, domains, domainsMeta } = this.props;
    const { activeTab } = this.state;
    const filteredDomains = values(domains).filter(d => d.disabled === (activeTab === 'disabled'));
    const showMore = !isNull(domainsMeta.next);
    return (
      <>
        <Header as="h2">Domains</Header>
        <Menu secondary className="noLeftPadding">
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
          <Menu secondary>
            <Menu.Item position="right">
              <AddDomain />
            </Menu.Item>
          </Menu>
        </Menu>

        <Table selectable className="bootstrapTableFix" basic="very" data-test="campaignsTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>ESP</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredDomains.map(domain => {
              return (
                <Table.Row
                  key={domain.id}
                  onClick={() => history.push(`${match.url}/${domain.id}`)}
                >
                  <Table.Cell>{domain.id}</Table.Cell>
                  <Table.Cell>{domain.name}</Table.Cell>
                  <Table.Cell>{domain.status}</Table.Cell>
                  <Table.Cell>{domain.esp}</Table.Cell>
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

export default connect<{}, {}, $FixMe>(
  (state: IRedux) => ({
    domains: getDomainsForCurrentOrg(state),
    domainsMeta: getDomainsMeta(state),
  }),
  {
    fetchDomains,
  },
)(Domains);
