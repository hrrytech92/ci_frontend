import { saveWelcomeMessage, fetchWelcomeMessage } from 'app/state/submission-forms/api';
import { getFirstDomain } from 'app/state/domains/selectors';
import { IWelcomeMessage } from 'app/definitions/submissionForm';
import { IDomain } from 'app/definitions/domain';
import { formatDateTime } from 'app/helpers/date';
import { getWelcomeMessage, getWelcomeMessageRelated } from 'app/state/submission-forms/selectors';

import EditWelcomeMessageForm from 'app/views/submission_forms/EditWelcomeMessage';

import { IRedux } from 'app/definitions/redux';
import { isEmpty, get, toPairs } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Label, Button } from 'semantic-ui-react';

interface IMatch {
  welcomeMessageId: number | 'new';
}

interface IProps extends RouteComponentProps<IMatch> {
  welcomeMessage: IWelcomeMessage;
  firstDomain: IDomain;
  welcomeMessageRelated: any;
  fetchWelcomeMessage?: (a) => IWelcomeMessage;
  saveWelcomeMessage: (a) => IWelcomeMessage;
}

interface IState {
  editing: boolean;
}

class Message extends React.Component<IProps, IState> {
  state = {
    editing: false,
  };

  async componentDidMount() {
    const { welcomeMessageId } = this.props.match.params;
    if (!this.isNewWelcomeMessage()) {
      await this.props.fetchWelcomeMessage(welcomeMessageId);
    }
  }

  isNewWelcomeMessage = () => {
    return this.props.match.params.welcomeMessageId === 'new';
  };

  handleCancel = e => {
    e.preventDefault();
    const welcomeMessagesUrl = this.props.history.location.pathname.replace('/new', '');
    if (this.isNewWelcomeMessage()) {
      this.props.history.push(welcomeMessagesUrl);
    } else {
      this.setState({ editing: false });
    }
  };

  handleSubmit = async values => {
    const { welcomeMessage } = this.props;
    let updatedWelcomeMessage;

    updatedWelcomeMessage = await this.props.saveWelcomeMessage(values);

    if (updatedWelcomeMessage && welcomeMessage.id) {
      this.props.history.push(String(welcomeMessage.id));
      this.setState({ editing: false });
    }
  };

  render() {
    let { welcomeMessage, welcomeMessageRelated, firstDomain } = this.props;

    const { editing } = this.state;

    if (!welcomeMessage || isEmpty(welcomeMessage)) {
      welcomeMessage = {
        domain: firstDomain ? firstDomain.id : null,
      } as IWelcomeMessage;
    }

    return (
      <>
        {this.isNewWelcomeMessage() || editing ? (
          <EditWelcomeMessageForm
            onSubmit={this.handleSubmit}
            initialValues={welcomeMessage}
            welcomeMessage={welcomeMessage}
            history={this.props.history}
            handleCancel={this.handleCancel}
          />
        ) : (
          <>
            <Menu secondary>
              <Menu.Item style={{ paddingLeft: 0 }}>
                <Header as="h3" data-test="messageHeader">
                  Name: {welcomeMessage.name}{' '}
                </Header>
              </Menu.Item>
              <Menu.Item position="right">
                <Button
                  content="Edit"
                  color="green"
                  icon="pencil"
                  onClick={() => this.setState({ editing: true })}
                />
              </Menu.Item>
            </Menu>
            <Table className="bootstrapTableFix" definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={2}>Subject</Table.Cell>
                  <Table.Cell>{welcomeMessage.subject}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Sender Name</Table.Cell>
                  <Table.Cell>{welcomeMessage.sender_name}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Sender Email</Table.Cell>
                  <Table.Cell>{welcomeMessage.sender_email}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Template</Table.Cell>
                  <Table.Cell>
                    <a href={get(welcomeMessageRelated, 'templateUrl', '')}>
                      {get(welcomeMessageRelated, 'template.name', '')}
                    </a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Variables</Table.Cell>
                  <Table.Cell>
                    {toPairs(welcomeMessage.variables).map((variablePair, i) => (
                      <Label basic key={i}>
                        {variablePair[0]}
                        <Label.Detail>{variablePair[1]}</Label.Detail>
                      </Label>
                    ))}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Created At</Table.Cell>
                  <Table.Cell>{formatDateTime(welcomeMessage.created_at)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Updated At</Table.Cell>
                  <Table.Cell>{formatDateTime(welcomeMessage.updated_at)}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    welcomeMessage: getWelcomeMessage(state, ownProps.match.params.welcomeMessageId),
    welcomeMessageRelated: getWelcomeMessageRelated(state, ownProps.match.params.welcomeMessageId),
    firstDomain: getFirstDomain(state),
  }),
  {
    saveWelcomeMessage,
    fetchWelcomeMessage,
  },
)(Message);
