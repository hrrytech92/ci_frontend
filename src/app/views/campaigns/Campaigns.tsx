import { IPaginatedMeta } from 'app/definitions/api';
import { ICampaign } from 'app/definitions/campaign';
import { IClient } from 'app/definitions/client';
import { IRedux } from 'app/definitions/redux';
import { addCampaign, fetchCampaigns } from 'app/state/campaigns/api';
import { getCampaignsForCurrentOrg, getCampaignsMeta } from 'app/state/campaigns/selectors';
import AddCampaign from 'app/views/campaigns/AddCampaign';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Label, Menu, Table } from 'semantic-ui-react';
import { isNull } from 'lodash';
import { formatDateTime } from 'app/helpers/date';
import { getClientsForCurrentOrg } from 'app/state/clients/selectors';

interface IProps extends RouteComponentProps<void> {
  campaigns?: ICampaign[];
  campaignsMeta: IPaginatedMeta;
  clients?: IClient[];
  addCampaign: typeof addCampaign;
  fetchCampaigns: typeof fetchCampaigns;
}

interface IState {
  activeTab: string;
}

class Campaigns extends React.Component<IProps> {
  state: IState = {
    activeTab: 'active',
  };

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  loadMore = () => {
    this.props.fetchCampaigns(this.props.campaignsMeta.next);
  };

  get disabled() {
    return this.props.campaigns.filter(c => c.disabled).length;
  }

  get active() {
    return this.props.campaigns.filter(c => !c.disabled).length;
  }

  render() {
    const { match, history, campaigns, campaignsMeta, clients } = this.props;
    const { activeTab } = this.state;

    const filteredCampaigns = campaigns
      .filter(c => c.disabled === (activeTab === 'disabled'))
      .map(c => ({
        ...c,
        client_name: clients.find(i => i.id.toString() === c.client)
          ? clients.find(i => i.id.toString() === c.client).name
          : '',
      }));

    const showMore = !isNull(campaignsMeta.next);

    return (
      <>
        <Header as="h2">Campaigns</Header>
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
          <Menu.Item position="right">
            <AddCampaign onSubmit={this.props.addCampaign} />
          </Menu.Item>
        </Menu>

        <Table selectable className="bootstrapTableFix" basic="very" data-test="campaignsTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell>Created on</Table.HeaderCell>
              <Table.HeaderCell>Client Name</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredCampaigns.map(campaign => {
              return (
                <Table.Row
                  key={campaign.id}
                  onClick={() => history.push(`${match.url}/${campaign.id}`)}
                >
                  <Table.Cell>{campaign.id}</Table.Cell>
                  <Table.Cell>{formatDateTime(campaign.created_on)}</Table.Cell>
                  <Table.Cell>{campaign.client_name}</Table.Cell>
                  <Table.Cell>{campaign.name}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMore && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={2}>
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

export default connect<{}, {}>(
  (state: IRedux) => ({
    campaigns: getCampaignsForCurrentOrg(state),
    campaignsMeta: getCampaignsMeta(state),
    clients: getClientsForCurrentOrg(state),
  }),
  {
    fetchCampaigns,
    addCampaign,
  },
)(Campaigns);
