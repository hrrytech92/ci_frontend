import { IPaginated, IPaginatedMeta } from 'app/definitions/api';
import { ICampaign } from 'app/definitions/campaign';
import { IMessage } from 'app/definitions/message';
import { IRedux } from 'app/definitions/redux';
import { ITemplate } from 'app/definitions/template';
import { formatDateTime } from 'app/helpers/date';
import {
  deleteCampaign,
  editCampaign,
  enableCampaign,
  fetchCampaigns,
} from 'app/state/campaigns/api';
import { getCampaign, getCampaignOptions, getCampaignsMeta } from 'app/state/campaigns/selectors';
import { getOrgUrl } from 'app/state/organizations/selectors';
import {
  cloneCampaignMessage,
  deleteCampaignMessage,
  fetchCampaignMessages,
  moveCampaignMessage,
} from 'app/state/messages/api';
import MoveMessage from 'app/views/campaigns/MoveMessage';
import { getMessagesForCampaign, getMessagesForCampaignMeta } from 'app/state/messages/selectors';
import { fetchTemplates } from 'app/state/templates/api';
import EditableHeader from 'app/views/campaigns/EditableHeader';
import { isEmpty, isNull, concat } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Message as SemanticMessage, Table } from 'semantic-ui-react';

interface IMatch {
  campaignId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  campaign?: ICampaign;
  getCampaignMessages?: (d?, e?) => IMessage[];
  getCampaigns: typeof fetchCampaigns;
  campaignMessagesMeta: IPaginatedMeta;
  campaignsMeta: IPaginatedMeta;
  campaignOptions: {}[];
  editCampaign?: (a, b) => void;
  messages?: IMessage[];
  enableCampaign?: (a) => void;
  deleteCampaign?: (a) => void;
  getTemplates?: (d) => IPaginated<ITemplate[]>;
  cloneMessage?: (c, m) => IMessage;
  moveMessage?: (c1, c2, m) => Promise<IMessage>;
  deleteMessage?: (a, b) => void;
  orgUrl: string;
}

interface IState {
  editModal: boolean;
  message: IMessage;
}

class Campaign extends React.Component<IProps> {
  state: IState = {
    editModal: false,
    message: {} as IMessage,
  };

  async componentDidMount() {
    this.props.getCampaignMessages(this.props.match.params.campaignId);
  }

  handleSubmit = async values => {
    const id = this.props.match.params.campaignId;
    await this.props.editCampaign(id, values);
  };

  delete = async message => {
    await this.props.deleteMessage(message.campaign, message.id);
  };

  clone = async message => {
    const clonedMessage = await this.props.cloneMessage(message.campaign, message.id);
    this.props.history.push(`${this.props.match.url}/messages/${clonedMessage.id}`);
  };

  toggleDisable = async () => {
    const { disabled } = this.props.campaign;
    const campaignId = this.props.match.params.campaignId;
    const c = confirm(`${disabled ? 'Enable' : 'Disable'} this Campaign?`);
    if (c) {
      if (!disabled) {
        await this.props.deleteCampaign(campaignId);
      } else {
        await this.props.enableCampaign(campaignId);
      }
    }
  };

  handleAddNew = () => {
    this.props.history.push(`${this.props.match.url}/messages/new`);
  };

  loadMoreCampaignMessages = () => {
    this.props.getCampaignMessages(false, this.props.campaignMessagesMeta.next);
  };

  loadMoreCampaigns = () => {
    this.props.getCampaigns(this.props.campaignsMeta.next);
  };

  moveMessage = async (messageId, newCampaignID) => {
    this.props
      .moveMessage(this.props.match.params.campaignId, newCampaignID, messageId)
      .then(() => {
        this.props.getCampaignMessages(newCampaignID);
        this.props.history.push(`${this.props.orgUrl}campaigns/${newCampaignID}`);
      });
  };

  render() {
    const {
      match,
      history,
      messages,
      campaign,
      campaignMessagesMeta,
      campaignsMeta,
      campaignOptions,
    } = this.props;
    const showMoreCampaignMessages = !isNull(campaignMessagesMeta.next);
    const showMoreCampaigns = !isNull(campaignsMeta.next);
    let paginatedCampaignOptions;

    if (showMoreCampaigns) {
      paginatedCampaignOptions = concat(campaignOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreCampaigns} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedCampaignOptions = campaignOptions;
    }

    if (!campaign) {
      return null;
    }

    return (
      <>
        {campaign.name && (
          <EditableHeader
            // Remove once rendering is fixed
            key={campaign.id}
            handleAddNew={this.handleAddNew}
            toggleDisable={this.toggleDisable}
            value={campaign}
            onSubmit={this.handleSubmit}
            disabled={campaign.disabled}
          />
        )}

        {isEmpty(messages) ? (
          <SemanticMessage>No messages yet</SemanticMessage>
        ) : (
          <>
            <Table selectable basic="very" className="bootstrapTableFix">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Subscribers</Table.HeaderCell>
                  <Table.HeaderCell>Updated On</Table.HeaderCell>
                  <Table.HeaderCell>Scheduled On</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {messages.map(message => {
                  return (
                    <Table.Row key={message.id}>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {message.id}
                      </Table.Cell>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {message.name}
                      </Table.Cell>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {message.actual_recipients || message.estimated_recipients}
                      </Table.Cell>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {formatDateTime(message.updated_on)}
                      </Table.Cell>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {formatDateTime(message.scheduled_on)}
                      </Table.Cell>
                      <Table.Cell
                        onClick={() => history.push(`${match.url}/messages/${message.id}`)}
                      >
                        {message.status}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="tiny"
                          compact
                          onClick={e => {
                            e.stopPropagation();
                            this.clone(message);
                          }}
                          icon="clone"
                          content="Clone"
                        />
                        <Button
                          size="tiny"
                          compact
                          disabled={message.status !== 'draft'}
                          content="Delete"
                          icon="trash"
                          negative
                          onClick={e => {
                            e.stopPropagation();
                            this.delete(message);
                          }}
                        />
                        <MoveMessage
                          onSubmit={newCampaign => {
                            this.moveMessage(message.id, newCampaign.campaign);
                          }}
                          campaignOptions={paginatedCampaignOptions}
                          disabled={message.status !== 'draft'}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              {showMoreCampaignMessages && (
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={7}>
                      <Button onClick={this.loadMoreCampaignMessages} fluid content="Load More" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          </>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    campaign: getCampaign(state, parseInt(ownProps.match.params.campaignId)),
    campaignOptions: getCampaignOptions(state),
    campaignsMeta: getCampaignsMeta(state),
    messages: getMessagesForCampaign(state, parseInt(ownProps.match.params.campaignId)),
    campaignMessagesMeta: getMessagesForCampaignMeta(state),
    orgUrl: getOrgUrl(state),
  }),
  {
    editCampaign,
    getCampaigns: fetchCampaigns,
    getCampaignMessages: fetchCampaignMessages,
    cloneMessage: cloneCampaignMessage,
    moveMessage: moveCampaignMessage,
    deleteMessage: deleteCampaignMessage,
    enableCampaign: enableCampaign,
    deleteCampaign: deleteCampaign,
    getTemplates: fetchTemplates,
  },
)(Campaign);
