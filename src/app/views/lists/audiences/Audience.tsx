import { IPaginatedMeta } from 'app/definitions/api';
import { IList } from 'app/definitions/list';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ISubscriber } from 'app/definitions/subscriber';
import { IAudience, IAudienceImport } from 'app/definitions/audience';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { formatDate } from 'app/helpers/date';
import { getListsUrl } from 'app/state/lists/selectors';
import {
  addAudience,
  editAudience,
  fetchAudiences,
  fetchAudienceMembers,
  fetchAudienceImports,
} from 'app/state/audiences/api';
import {
  getAudience,
  getAudienceMembers,
  getAudienceMembersMeta,
  getAudienceImports,
  getAudienceImportsMeta,
} from 'app/state/audiences/selectors';
import EditableHeader from 'app/views/lists/audiences/EditableHeader';
import AudienceMembers from 'app/views/lists/audiences/AudienceMembers';
import AudienceImports from 'app/views/lists/audiences/AudienceImports';
import { parseInt, isEmpty, isUndefined, isNull } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import BulkImport from 'app/views/lists/audiences/BulkImport';
import { Menu, Modal } from 'semantic-ui-react';

interface IMatch {
  audienceId: string;
  listId: string;
}

interface StateProps {
  organization?: IOrganization;
  lists?: IList[];
  audience?: IAudience;
  audienceMembers: ISubscriber[];
  audienceMembersMeta: IPaginatedMeta;
  audienceImports: IAudienceImport[];
  audienceImportsMeta: IPaginatedMeta;
  listsUrl: string;
}

interface DispatchProps {
  editAudience: typeof editAudience;
  addAudience: typeof addAudience;
  fetchAudiences: typeof fetchAudiences;
  fetchAudienceMembers: typeof fetchAudienceMembers;
  fetchAudienceImports: typeof fetchAudienceImports;
}

interface OwnProps extends RouteComponentProps<IMatch> {}

interface IState {
  editing: boolean;
  modal: boolean;
  activeTab: string;
}

class Audience extends React.Component<OwnProps & StateProps & DispatchProps, IState> {
  state: IState = {
    editing: false,
    modal: false,
    activeTab: 'members',
  };

  componentDidMount() {
    const { audienceId, listId } = this.props.match.params;
    this.props.fetchAudiences(parseInt(listId));
    if (audienceId !== 'new' && !isUndefined(audienceId)) {
      this.props.fetchAudienceMembers(parseInt(listId), parseInt(audienceId), '');
      this.props.fetchAudienceImports('', parseInt(listId), parseInt(audienceId));
    }
  }

  import = () => {
    this.setState({ modal: true });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  edit = audience => {
    this.props.editAudience(
      parseInt(this.props.match.params.listId),
      this.props.audience.id,
      audience,
    );
  };

  navigateToAudience = (id?: number) => {
    const { listId } = this.props.match.params;
    if (id) {
      this.props.history.replace(
        `/org/${this.props.organization.id}/lists/${listId}/audiences/${id}`,
      );
    } else {
      this.props.history.replace(`/org/${this.props.organization.id}/lists/${listId}/audiences/`);
    }
  };
  loadMore = () => {
    this.props.fetchAudienceMembers(null, null, this.props.audienceMembersMeta.next);
  };
  loadMoreImports = () => {
    this.props.fetchAudienceImports(this.props.audienceImportsMeta.next, null, null);
  };
  submit = values => {
    const audienceId = values.id;
    const { listId } = this.props.match.params;
    if (this.isNew()) {
      // @ts-ignore
      this.props.addAudience(parseInt(listId), values).then(({ id }) => {
        this.setState({ editing: false });
        this.navigateToAudience(id);
      });
    } else {
      // @ts-ignore
      this.props.editAudience(parseInt(listId), audienceId, values).then(response => {
        if (response.id) {
          this.props.fetchAudienceMembers(parseInt(listId), audienceId, '');
          this.setState({ editing: false });
        }
      });
    }
  };

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  isNew = () => {
    if (this.props.match.params.audienceId === 'new') {
      return true;
    }

    return false;
  };

  render() {
    const { editing, modal, activeTab } = this.state;
    const {
      match: {
        params: { listId, audienceId },
      },
    } = this.props;
    let {
      audience,
      audienceMembers,
      audienceMembersMeta,
      audienceImports,
      audienceImportsMeta,
    } = this.props;
    editing;
    listId;
    const showMore = !isNull(audienceMembersMeta.next);
    const showMoreImports = !isNull(audienceImportsMeta.next);
    return (
      <>
        {!isEmpty(audience) && (
          <EditableHeader
            onSubmit={this.edit}
            audience={audience}
            importFn={this.import.bind(this)}
          />
        )}

        <p className="small">
          Created At: {audience && formatDate(audience.created_on)}
          <br />
          Last Updated: {audience && formatDate(audience.updated_on)}
          <br />
          Membership Count: {audience && audience.members_count}
          <br />
        </p>
        <Menu secondary>
          <Menu.Item
            name="members"
            active={activeTab === 'members'}
            onClick={this.handleTabClick}
          />
          <Menu.Item
            name="imports"
            active={activeTab === 'imports'}
            onClick={this.handleTabClick}
          />
        </Menu>
        {activeTab === 'members' && audience && (
          <AudienceMembers
            members={audienceMembers}
            push={this.props.history.push}
            orgId={this.props.organization.id}
            showMore={showMore}
            loadMore={this.loadMore}
          />
        )}
        {activeTab === 'imports' && audienceImports && (
          <AudienceImports
            imports={audienceImports}
            showMore={showMoreImports}
            loadMore={this.loadMoreImports}
          />
        )}
        <Modal
          open={modal}
          onClose={this.toggle}
          toggle={this.toggle}
          className="bootstrapModalFix"
        >
          <Modal.Header toggle={this.toggle}>Import Audience Members</Modal.Header>
          <Modal.Content>
            <BulkImport
              onSuccess={this.toggle}
              listId={parseInt(listId)}
              audienceId={parseInt(audienceId)}
            />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default connect<StateProps, DispatchProps>(
  (state: IRedux, ownProps: OwnProps): StateProps => ({
    organization: getActiveOrganization(state),
    audience: getAudience(state, parseInt(ownProps.match.params.audienceId)),
    audienceMembers: getAudienceMembers(state, parseInt(ownProps.match.params.audienceId)),
    audienceMembersMeta: getAudienceMembersMeta(state),
    audienceImports: getAudienceImports(state, parseInt(ownProps.match.params.audienceId)),
    audienceImportsMeta: getAudienceImportsMeta(state),
    listsUrl: getListsUrl(state),
  }),
  {
    editAudience,
    addAudience,
    fetchAudiences,
    fetchAudienceMembers,
    fetchAudienceImports,
  },
)(Audience);
