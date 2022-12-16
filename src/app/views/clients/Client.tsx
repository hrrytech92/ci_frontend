import Form from 'app/base-classes/form/Form';
import { IClient } from 'app/definitions/client';
import { IRedux } from 'app/definitions/redux';
import { formatDate } from 'app/helpers/date';
import { deleteClient, editClient, enableClient, fetchClient } from 'app/state/clients/api';
import { getClient } from 'app/state/clients/selectors';
// import { getActiveOrganization } from 'app/state/organizations/selectors';
import EditableHeader from 'app/views/clients/EditableHeader';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
// import { Button, Menu, Search, Table } from 'semantic-ui-react';
import './client.scss';
// import { isNull } from 'util';

interface IMatch {
  clientId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  deleteClient: (d) => void;
  fetchClient(clientId: string): void;
  updateClient: (a, b) => void;
  enableClient: (a) => void;
  client: IClient;
}

interface IState {
  activeTab: string;
}

class Client extends Form<IProps, IState> {
  componentDidMount() {
    const clientId = this.props.match.params.clientId;
    this.props.fetchClient(clientId);
  }

  edit = client => {
    this.props.updateClient(this.props.client.id, client);
  };

  toggleDisable = async () => {
    const { client } = this.props;
    const c = confirm(`Delete this Client?`);
    if (c) {
      await this.props.deleteClient(client.id);
      this.props.history.goBack();
    }
  };

  render() {
    const { client } = this.props;
    if (!client) {
      return null;
    }
    return (
      <>
        {!isEmpty(client) && (
          <EditableHeader
            onSubmit={this.edit}
            toggleDisable={this.toggleDisable}
            client={client}
          />
        )}

        <p className="small">
          Created At: {formatDate(client.created_on)}
          <br />
          Last Updated: {formatDate(client.updated_on)}
        </p>
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    client: getClient(state, ownProps.match.params.clientId),
    // organization: getActiveOrganization(state),
  }),
  {
    fetchClient,
    updateClient: editClient,
    deleteClient,
    enableClient,
  },
)(Client);
