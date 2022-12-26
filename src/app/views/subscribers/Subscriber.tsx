import { IMessage } from 'app/definitions/message';
import { IRedux } from 'app/definitions/redux';
import { ISubscriber } from 'app/definitions/subscriber';
import { formatDate } from 'app/helpers/date';
import { getListOptions } from 'app/state/lists/selectors';
import { showError } from 'app/state/notifications/actions';
import {
  addListMembers,
  deleteSubscriber,
  editSubscriber,
  fetchSubscriber,
  updateListMember,
} from 'app/state/subscribers/api';
import { getSubscriber } from 'app/state/subscribers/selectors';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItemProps,
  Header,
  Menu,
  Table,
  TextArea,
} from 'semantic-ui-react';

interface IMatch {
  subscriberId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  subscriber?: ISubscriber;
  fetchSubscriber: typeof fetchSubscriber;
  getSubscriberMessages: (d) => IMessage[];
  deleteSubscriber: typeof deleteSubscriber;
  editSubscriber: typeof editSubscriber;
  showError: (a) => void;
  addListMembers: typeof addListMembers;
  updateListMember: typeof updateListMember;
  listOptions?: DropdownItemProps[];
}

interface IState {
  variables: string;
}

class Subscriber extends React.Component<IProps, IState> {
  state: IState = {
    variables: '',
  };

  componentDidMount() {
    const id = this.props.match.params.subscriberId;

    // @ts-ignore
    this.props.fetchSubscriber(id).then(subscriber => {
      this.setState({ variables: JSON.stringify(subscriber.custom_data, null, 4) });
    });
  }

  edit = e => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(this.state.variables);

      const id = this.props.match.params.subscriberId;
      this.props.editSubscriber(id, {
        custom_data: JSON.parse(this.state.variables),
      });

      // reformat
      this.setState({ variables: JSON.stringify(parsed, null, 4) });
    } catch (e) {
      this.props.showError('Error Invalid JSON!');
    }
  };

  handleAdd = listId => {
    const subscriberId = this.props.match.params.subscriberId;
    this.props.addListMembers(listId, subscriberId);
  };

  handleSubscribe = listId => {
    const subscriberId = this.props.match.params.subscriberId;
    this.props.updateListMember(listId, subscriberId, { status: 0 });
  };

  handleUnSubscribe = listId => {
    const subscriberId = this.props.match.params.subscriberId;
    this.props.updateListMember(listId, subscriberId, { status: 1 });
  };

  delete = async () => {
    const c = confirm('Delete this subscriber?');
    if (c) {
      await this.props.deleteSubscriber(this.props.match.params.subscriberId);
      this.props.history.replace('/org/subscribers');
    }
  };

  filteredListOptions = () => {
    const { subscriptions } = this.props.subscriber;
    if (subscriptions) {
      const flattened = subscriptions.map(s => parseInt(s.list_id));
      // @ts-ignore
      return this.props.listOptions.filter(option => flattened.indexOf(option.value) === -1);
    }
    return this.props.listOptions;
  };

  sortByList = (a, b) => a.list_id - b.list_id;

  render() {
    const { subscriber } = this.props;
    const { variables } = this.state;

    if (!subscriber) {
      return null;
    }

    const listOptions = this.filteredListOptions();

    const { email, subscriptions } = subscriber;

    return (
      <>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Header as="h3">{email}</Header>
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="green" content="Save" onClick={this.edit} />
            &nbsp;
            <Button color="red" content={`Delete ${email}`} onClick={this.delete} />
          </Menu.Item>
        </Menu>
        <Header as="h4">Variables</Header>
        <TextArea
          rows="10"
          data-test="variablesTextarea"
          type="textarea"
          value={variables}
          style={{ width: '100%' }}
          placeholder="Variables"
          name="variables"
          onChange={e => this.setState({ variables: e.currentTarget.value })}
        />
        <p className="small">JSON Document containing the subscriber's variables.</p>
        <hr />
        <Header as="h3">Subscriptions</Header>

        <Dropdown
          data-test="addSubscriberDropdown"
          disabled={listOptions.length === 0}
          selectOnBlur={false}
          selectOnNavigation={false}
          placeholder="Add subscriber to list"
          onChange={(e, { value }) => this.handleAdd(value)}
          selection
          options={listOptions}
        />

        <Table selectable basic="very" className="bootstrapTableFix" data-test="subscriberTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>List Name</Table.HeaderCell>
              <Table.HeaderCell>Double Opt</Table.HeaderCell>
              <Table.HeaderCell>Subscribe Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {subscriptions &&
              subscriptions.sort(this.sortByList).map(subscription => (
                <Table.Row>
                  <Table.Cell>{subscription.list_name}</Table.Cell>
                  <Table.Cell>{formatDate(subscription.double_opt)}</Table.Cell>
                  <Table.Cell>{formatDate(subscription.subscribe_date)}</Table.Cell>
                  <Table.Cell width={3}>
                    <Checkbox
                      toggle
                      data-test="subscribeCheckbox"
                      label={subscription.status === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}
                      onChange={(e, { checked }) => {
                        if (checked) {
                          this.handleSubscribe(subscription.list_id);
                        } else {
                          this.handleUnSubscribe(subscription.list_id);
                        }
                      }}
                      checked={subscription.status === 'subscribed'}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default connect<{}, {}, RouteComponentProps<IMatch>>(
  (state: IRedux, ownProps) => ({
    listOptions: getListOptions(state),
    subscriber: getSubscriber(state, ownProps.match.params.subscriberId),
  }),
  {
    editSubscriber,
    fetchSubscriber,
    showError,
    deleteSubscriber,
    addListMembers,
    updateListMember,
  },
)(Subscriber);
