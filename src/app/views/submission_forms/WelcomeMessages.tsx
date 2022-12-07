import { IWelcomeMessage } from 'app/definitions/submissionForm';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { formatDateTime } from 'app/helpers/date';
import { fetchWelcomeMessages } from 'app/state/submission-forms/api';
import { getWelcomeMessages, getWelcomeMessagesMeta } from 'app/state/submission-forms/selectors';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Button } from 'semantic-ui-react';
import { isNull } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  welcomeMessages?: IWelcomeMessage[];
  welcomeMessagesMeta: IPaginatedMeta;
  fetchWelcomeMessages: typeof fetchWelcomeMessages;
  deleteWelcomeMessage(WelcomeMEssageId): void;
}

class WelcomeMessages extends React.Component<IProps> {
  loadMoreWelcomeMessages = () => {
    this.props.fetchWelcomeMessages(this.props.welcomeMessagesMeta.next);
  };

  handleAddNewWelcomeMessage = () => {
    this.props.history.push(`${this.props.match.url}/new`);
  };

  render() {
    const { match, history, welcomeMessages, welcomeMessagesMeta } = this.props;

    const showMoreWelcomeMessages = !isNull(welcomeMessagesMeta.next);

    return (
      <>
        <Header as="h2">Welcome Messages</Header>
        <Menu secondary>
          <Menu.Item position="right">
            <Button
              onClick={this.handleAddNewWelcomeMessage}
              color="green"
              icon="plus"
              content="Add Welcome Message"
            />
          </Menu.Item>
        </Menu>
        <Table selectable className="bootstrapTableFix" data-test="listsTable" basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Sender Name</Table.HeaderCell>
              <Table.HeaderCell>Subject</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Updated At</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {welcomeMessages.map(wm => {
              return (
                <Table.Row key={wm.id} onClick={() => history.push(`${match.url}/${wm.id}`)}>
                  <Table.Cell>{wm.id}</Table.Cell>
                  <Table.Cell>{wm.name}</Table.Cell>
                  <Table.Cell>{wm.sender_name}</Table.Cell>
                  <Table.Cell>{wm.subject}</Table.Cell>
                  <Table.Cell>{formatDateTime(wm.created_at)}</Table.Cell>
                  <Table.Cell>{formatDateTime(wm.updated_at)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMoreWelcomeMessages && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button onClick={this.loadMoreWelcomeMessages} fluid content="Load More" />
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  welcomeMessages: getWelcomeMessages(state),
  welcomeMessagesMeta: getWelcomeMessagesMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    fetchWelcomeMessages,
  },
)(WelcomeMessages);
