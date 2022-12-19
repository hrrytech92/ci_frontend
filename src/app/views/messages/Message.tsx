import { IDomain } from 'app/definitions/domain';
import { IMessage } from 'app/definitions/message';
import { ITemplate } from 'app/definitions/template';
import { IRedux } from 'app/definitions/redux';
import { formatDateTime } from 'app/helpers/date';
import { getCampaignUrl } from 'app/state/campaigns/selectors';
import { getFirstDomain } from 'app/state/domains/selectors';
import {
  addCampaignMessage,
  editCampaignMessage,
  fetchCampaignMessage,
  scheduleCampaignMessage,
  unScheduleCampaignMessage,
  fetchMessages,
} from 'app/state/messages/api';
import { getMessage } from 'app/state/messages/selectors';
import { fetchListSegments, fetchListSegment } from 'app/state/segments/api';
import { fetchAudiences, fetchAudience } from 'app/state/audiences/api';
import { fetchTemplate } from 'app/state/templates/api';
import EditMessageForm from 'app/views/messages/EditMessageForm';
import MessageSummaryList from 'app/views/messages/MessageSummaryList';
import SchedulePopup from 'app/views/messages/SchedulePopup';
import { omit, upperFirst, get } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Icon, Label, Menu, Message as SemanticMessage } from 'semantic-ui-react';
import { fetchList } from 'app/state/lists/api';
import { fetchDomain } from 'app/state/domains/api';
import config from 'app/config';
import { getOrgApiUrl } from 'app/actions/url';
import { isNull } from 'util';
import ApplyTags from '../tags/ApplyTags';
import { addTag, fetchTags } from '../../state/tags/api';
import { ITag } from 'app/definitions/tag';

interface IMatch {
  messageId: number | 'new';
  campaignId: number;
  organizationId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  campaignUrl: string;
  message: IMessage;
  firstDomain: IDomain;
  addTag: (t: ITag) => any;
  fetchTags: () => any;
  fetchMessages: () => any;
  fetchCampaignMessage?: (a, b) => IMessage;
  fetchListSegments(listId: number): void;
  fetchAudiences(listId: number): void;
  fetchTemplate: (templateId: number) => ITemplate;
  unScheduleCampaignMessage(campaignId: number, messageId: number): void;
  scheduleCampaignMessage(campaignId: number, messageId: number, sendTime: string): void;
  addCampaignMessage: (campaignId: number, message: IMessage) => IMessage;
  editCampaignMessage: (campaignId: number, messageId: number, message: IMessage) => IMessage;
  fetchList: typeof fetchList;
  fetchListSegment: typeof fetchListSegment;
  fetchAudience: typeof fetchAudience;
  fetchDomain: typeof fetchDomain;
}

interface IState {
  editing: boolean;
}

class Message extends React.Component<IProps, IState> {
  state = {
    editing: false,
  };

  async componentDidMount() {
    this.loadMessage();
    this.props.fetchTags();
  }

  loadMessage = async () => {
    const { messageId, campaignId } = this.props.match.params;
    if (!this.isNewMessage()) {
      const message = await this.props.fetchCampaignMessage(campaignId, messageId);
      this.props.fetchTemplate(message.template);
      // @TODO serialize on API
      if (message.list) {
        this.props.fetchList(message.list);
        this.props.fetchListSegments(message.list);
        this.props.fetchAudiences(message.list);

        if (message.segment) {
          this.props.fetchListSegment(message.list, message.segment);
        }
        if (message.audience) {
          this.props.fetchAudience(message.list, message.audience);
        }
      }
      this.props.fetchDomain(message.domain);
    }
  };

  isNewMessage = () => {
    return this.props.match.params.messageId === 'new';
  };

  handleCancel = () => {
    if (this.isNewMessage()) {
      this.props.history.push(this.props.campaignUrl);
    } else {
      this.setState({ editing: false });
    }
  };

  scheduleCampaignMessage = value => {
    return this.props.scheduleCampaignMessage(
      this.props.match.params.campaignId,
      this.props.message.id,
      value,
    );
  };

  unschedule = () => {
    this.props.unScheduleCampaignMessage(
      this.props.match.params.campaignId,
      this.props.message.id,
    );
  };

  handleApplyTagSubmit = async tag => {
    let {
      message,
      match: {
        params: { campaignId },
      },
    } = this.props;
    message.tags.push(tag);
    this.props.editCampaignMessage(campaignId, message.id, message);
  };

  handleApplyTagEnter = async tag => {
    tag.org = this.props.match.params.organizationId;
    const t = await this.props.addTag(tag);
    this.handleApplyTagSubmit(t);
    this.loadMessage();
  };

  handleRemoveTag = async id => {
    let {
      message,
      match: {
        params: { campaignId },
      },
    } = this.props;
    message.tags = this.props.message.tags.filter(tag => tag.id != id);
    this.props.editCampaignMessage(campaignId, message.id, message);
  };

  handleSubmit = async values => {
    const {
      message,
      match: {
        params: { campaignId },
      },
    } = this.props;
    let updatedMessage;

    // @TODO handle on the API
    values = omit(values, ['scheduled_send_time', 'status']);

    if (isNull(values.segment)) {
      values = omit(values, ['segment']);
    }

    if (isNull(values.audience)) {
      values = omit(values, ['audience']);
    }

    if (message && message.id) {
      updatedMessage = await this.props.editCampaignMessage(campaignId, message.id, values);
    } else {
      updatedMessage = await this.props.addCampaignMessage(campaignId, values);
    }

    if (updatedMessage && updatedMessage.id) {
      this.props.history.push(String(updatedMessage.id));
      this.setState({ editing: false });
    }
  };

  render() {
    let {
      message,
      firstDomain,
      match: {
        params: { campaignId },
      },
    } = this.props;
    const { editing } = this.state;
    let previewUrl;
    if (get(message, 'template_version')) {
      previewUrl =
        config.API_URL +
        getOrgApiUrl(
          'templates/' +
            get(message, 'template') +
            '/' +
            get(message, 'template_version') +
            '/preview',
        );
    } else {
      previewUrl =
        config.API_URL + getOrgApiUrl('templates/' + get(message, 'template') + '/preview');
    }

    if (!message) {
      previewUrl = '';
      message = {
        domain: firstDomain ? firstDomain.id : null,
      } as IMessage;
    }

    return (
      <>
        {this.isNewMessage() || editing ? (
          <EditMessageForm
            onSubmit={this.handleSubmit}
            // @TODO fix this on API
            initialValues={omit(message, ['type', 'status', 'send_type'])}
            message={message}
            campaignId={campaignId}
            history={this.props.history}
            handleCancel={this.handleCancel}
          />
        ) : (
          <>
            <Menu secondary>
              <Menu.Item style={{ paddingLeft: 0 }}>
                <Header as="h3" data-test="messageHeader">
                  {message.name}{' '}
                  {message.status !== 'scheduled' && <Label>{upperFirst(message.status)}</Label>}
                </Header>
              </Menu.Item>

              {message.status === 'draft' && (
                <Menu.Item position="right">
                  <a href={previewUrl} target="_blank">
                    <Button
                      color="blue"
                      content="Preview"
                      icon="external square alternate"
                      disabled={this.isNewMessage()}
                    />
                  </a>
                  &nbsp;
                  <ApplyTags
                    onSubmit={e => {
                      this.handleApplyTagSubmit(e);
                    }}
                    onEnter={e => {
                      this.handleApplyTagEnter(e);
                    }}
                    exclude={message.tags && message.tags.map(t => t.id)}
                  />
                  &nbsp;
                  <Button
                    content="Edit"
                    color="green"
                    icon="pencil"
                    onClick={() => this.setState({ editing: true })}
                  />
                  &nbsp;
                  <SchedulePopup
                    scheduleCampaignMessage={this.scheduleCampaignMessage}
                    scheduledSendTime={message.scheduled_send_time}
                  />
                </Menu.Item>
              )}
            </Menu>
            <small>
              <div>Estimated Recipients: {message.estimated_recipients}</div>
              <div>Actual Recipients: {message.actual_recipients}</div>
            </small>
            {message.status === 'scheduled' && (
              <SemanticMessage
                warning
                icon="clock"
                content={
                  <>
                    Scheduled for {formatDateTime(message.scheduled_send_time)}.{' '}
                    <a href="#" onClick={this.unschedule}>
                      Unschedule
                    </a>
                  </>
                }
              />
            )}
            <MessageSummaryList message={message} />
            {message.tags && message.tags.length > 0 ? (
              <table className="ui selectable celled table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {message.tags.map(tag => {
                    return (
                      <tr
                        key={tag.id}
                        onClick={() => {
                          this.props.history.push(
                            `/org/${this.props.match.params.organizationId}/tags/${tag.id}`,
                          );
                        }}
                      >
                        <td data-label="Name">{tag.name}</td>
                        <td
                          style={{
                            width: '50px',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            this.handleRemoveTag(tag.id);
                          }}
                        >
                          <Icon name="trash alternate" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No tags found for this template.</p>
            )}
          </>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    campaignUrl: getCampaignUrl(state, ownProps.match.params.campaignId),
    message: getMessage(state, ownProps.match.params.messageId),
    firstDomain: getFirstDomain(state),
  }),
  {
    addTag,
    fetchTags,
    fetchMessages,
    fetchListSegments,
    fetchAudiences,
    unScheduleCampaignMessage,
    scheduleCampaignMessage,
    editCampaignMessage,
    addCampaignMessage,
    fetchCampaignMessage,
    fetchTemplate,
    fetchList,
    fetchListSegment,
    fetchAudience,
    fetchDomain,
  },
)(Message);
