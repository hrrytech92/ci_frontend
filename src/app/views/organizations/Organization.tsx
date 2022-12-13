import { getFileImports } from 'app/actions/fileImport';
import { IPaginated, IPaginatedMeta } from 'app/definitions/api';
import { IFileImport } from 'app/definitions/fileImport';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { setOrg } from 'app/state/organizations/actions';
import { deleteOrg, editOrg, getOrgDetail } from 'app/state/organizations/api';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { ReduxFormVariables } from 'app/views/messages/ReduxFormInput';
import EditableHeader from 'app/views/organizations/EditableHeader';
import Integrations from 'app/views/organizations/Integrations';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Form, Header, Button } from 'semantic-ui-react';
import ImportCard from './import-card';
import { isNull, omit, concat } from 'lodash';

interface IMatch {
  organizationId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  organization: IOrganization;
  setOrg(string): void;
  getOrgDetail: (i) => IOrganization;
  editOrg: (a, b) => void;
  deleteOrg(orgId: string): void;
  match: any;
  getFileImports?: (a?: string) => Promise<IPaginated<IFileImport[]>>;
}

interface IState {
  fileImports: IFileImport[];
  fileImportsMeta: IPaginatedMeta;
}

class Organization extends React.Component<IProps, IState> {
  state: IState = {
    fileImports: [] as IFileImport[],
    fileImportsMeta: {
      count: 0,
      next: null,
      previous: null,
    } as IPaginatedMeta,
  };

  async componentDidMount() {
    this.props.setOrg(this.props.match.params.organizationId);
    this.props.getOrgDetail(this.props.match.params.organizationId);
    this.getFileImports();
  }

  async getFileImports() {
    const data = await this.props.getFileImports();
    this.setState({ fileImports: data.results, fileImportsMeta: omit(data, 'results') });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.getFileImports();
    }
  }

  async loadMoreFileImports() {
    const data = await this.props.getFileImports(this.state.fileImportsMeta.next);
    this.setState({
      fileImports: concat(this.state.fileImports, data.results),
      fileImportsMeta: omit(data, 'results'),
    });
  }

  updateName = name => {
    const id = this.props.match.params.organizationId;
    this.props.editOrg(id, {
      account_name: name,
    });
  };

  deleteOrg = () => {
    const c = window.confirm('Are you sure you want to delete this organization');

    if (c) {
      this.props.deleteOrg(this.props.match.params.organizationId);
      this.props.history.push('/organizations');
    }
  };

  render() {
    if (!this.props.organization) {
      return null;
    }

    const { fileImports, fileImportsMeta } = this.state;
    const { variables, integrations, id } = this.props.organization;
    const input = {
      value: variables,
      onChange: variables => {
        this.props.editOrg(id, { variables });
      },
    };
    const showMoreFileImports = !isNull(fileImportsMeta.next);

    return (
      <>
        <EditableHeader
          key={id}
          deleteOrg={this.deleteOrg}
          value={this.props.organization.account_name}
          onSubmit={this.updateName}
        />
        <Form>
          <ReduxFormVariables title="Default Variables" input={input} />
        </Form>

        <Header as="h3">Integrations</Header>

        {integrations && (
          <Integrations organization={this.props.organization} integrations={integrations} />
        )}

        <Header as="h3">File Imports</Header>
        {fileImports && (
          <>
            {fileImports.length < 1 && <p>Nothing Yet</p>}
            {fileImports.map((file, id) => (
              <ImportCard key={id} file={file} />
            ))}
            {showMoreFileImports && (
              <Button onClick={this.loadMoreFileImports.bind(this)} fluid content="Load More" />
            )}
          </>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    organization: getActiveOrganization(state),
  }),
  {
    setOrg,
    deleteOrg,
    editOrg,
    getFileImports,
    getOrgDetail,
  },
)(Organization);
