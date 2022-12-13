import BulkImport from 'app/components/bulk-import/BulkImport';
import { IPaginatedMeta } from 'app/definitions/api';
import { IRedux } from 'app/definitions/redux';
import { ISubscriber } from 'app/definitions/subscriber';
import { formatDateTime } from 'app/helpers/date';
import { addSubscriber, fetchSubscribers, searchSubscribers } from 'app/state/subscribers/api';
import { getSubscribersForCurrentOrg, getSubscribersMeta } from 'app/state/subscribers/selectors';
import AddSubscriber from 'app/views/subscribers/AddSubscriber';
import { debounce, isEmpty, isNull } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Menu, Modal, Placeholder, Search, Table } from 'semantic-ui-react';

interface IProps extends RouteComponentProps<void> {
  subscribers?: ISubscriber[];
  subscribersMeta: IPaginatedMeta;
  addSubscriber(d: ISubscriber): void;
  fetchSubscribers: (params) => Promise<ISubscriber>;
  searchSubscribers: (search) => Promise<ISubscriber>;
}

interface IState {
  modal: boolean;
  value: string;
  isFetching: boolean;
}

class Subscribers extends React.Component<IProps, IState> {
  state: IState = {
    modal: false,
    isFetching: true,
    value: '',
  };

  componentDidMount() {
    this.props.fetchSubscribers('').then(() => {
      this.setState({ isFetching: false });
    });
  }

  import = () => {
    this.setState({ modal: true });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSearch = debounce(
    (e, { value }) => {
      this.setState({ isFetching: true });
      this.props.searchSubscribers(value).then(() => {
        this.setState({ isFetching: false });
      });
    },
    500,
    { leading: true },
  );

  loadMore = () => {
    this.props.fetchSubscribers(this.props.subscribersMeta.next);
  };

  render() {
    const { history, match, subscribers, subscribersMeta } = this.props;
    const { modal, isFetching } = this.state;
    const showLoader = isFetching;
    const noResults = isEmpty(subscribers) && !isFetching;
    const showMore = !isNull(subscribersMeta.next);
    return (
      <>
        <Header as="h2">Subscribers</Header>
        <Menu secondary pointing>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Search
              placeholder="Search"
              loading={false}
              resultRenderer={null}
              showNoResults={false}
              onSearchChange={this.handleSearch}
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="green" onClick={this.import} content="Bulk Import" icon="file" />
            &nbsp;
            <AddSubscriber onSubmit={this.props.addSubscriber} />
          </Menu.Item>
        </Menu>

        <Table selectable className="bootstrapTableFix" basic="very" data-test="subscribersTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {noResults && (
              <Table.Row>
                <Table.Cell>No results</Table.Cell>
              </Table.Row>
            )}

            {showLoader ? (
              <Table.Row>
                <Table.Cell>
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                </Table.Cell>
                <Table.Cell>
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                </Table.Cell>
              </Table.Row>
            ) : (
              <>
                {subscribers.map(subscriber => (
                  <Table.Row
                    key={subscriber.id}
                    onClick={() => history.push(`${match.url}/${subscriber.id}`)}
                  >
                    <Table.Cell>{subscriber.email}</Table.Cell>
                    <Table.Cell>{formatDateTime(subscriber.updated_on)}</Table.Cell>
                  </Table.Row>
                ))}
              </>
            )}
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

        <Modal
          open={modal}
          onClose={this.toggle}
          toggle={this.toggle}
          className="bootstrapModalFix"
        >
          <Modal.Header toggle={this.toggle}>Import Subscribers</Modal.Header>
          <Modal.Content>
            <BulkImport onSuccess={this.toggle} />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    subscribers: getSubscribersForCurrentOrg(state),
    subscribersMeta: getSubscribersMeta(state),
  }),
  {
    addSubscriber,
    fetchSubscribers,
    searchSubscribers,
  },
)(Subscribers);
