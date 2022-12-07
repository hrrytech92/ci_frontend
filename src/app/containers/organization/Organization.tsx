import Actions from 'app/actions/actions';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization, getOrganizations } from 'app/state/organizations/selectors';
import Campaign from 'app/views/campaigns/Campaign';
import Campaigns from 'app/views/campaigns/Campaigns';
import Domain from 'app/views/domains/Domain';
import Domains from 'app/views/domains/Domains';
import List from 'app/views/lists/List';
import Lists from 'app/views/lists/Lists';
import SuppressionLists from 'app/views/suppression_lists/SuppressionLists';
import SubmissionForms from 'app/views/submission_forms/SubmissionForms';
import SubmissionForm from 'app/views/submission_forms/SubmissionForm';
import WelcomeMessage from 'app/views/submission_forms/WelcomeMessage';
import WelcomeMessages from 'app/views/submission_forms/WelcomeMessages';
import SuppressionList from 'app/views/suppression_lists/SuppressionList';
import BulkDonationImports from 'app/views/payments/BulkDonationImports';
import Segment from 'app/views/lists/segments/Segment';
import Audience from 'app/views/lists/audiences/Audience';
import Message from 'app/views/messages/Message';
import Subscriber from 'app/views/subscribers/Subscriber';
import Subscribers from 'app/views/subscribers/Subscribers';
import Teams from 'app/views/teams/Teams';
import Template from 'app/views/templates/Template';
import Templates from 'app/views/templates/Templates';
import Users from 'app/views/users/Users';
import Clients from 'app/views/clients/Clients';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import Tags from 'app/views/tags/Tags';
import Tag from 'app/views/tags/Tag';
import Client from 'app/views/clients/Client';

interface IProps extends RouteComponentProps<any> {
  setOrg: (org: string) => void;
  organization: IOrganization;
  organizations: IOrganization[];
  showError: (m) => void;
}

class Organization extends React.Component<IProps> {
  componentDidMount() {
    const { organizationId } = this.props.match.params;
    this.props.setOrg(organizationId);
  }

  render() {
    const { organizationId } = this.props.match.params;

    if (!this.props.organization) {
      return null;
    }

    return (
      <Switch>
        <Route exact path={`/org/${organizationId}/templates`} component={Templates} />
        <Route exact path={`/org/${organizationId}/templates/:templateId`} component={Template} />
        <Route exact path={`/org/${organizationId}/details`} component={Organization} />
        <Route exact path={`/org/${organizationId}/teams`} component={Teams} />
        <Route exact path={`/org/${organizationId}/campaigns`} component={Campaigns} />
        <Route exact path={`/org/${organizationId}/campaigns/:campaignId`} component={Campaign} />
        <Route
          exact
          path={`/org/${organizationId}/campaigns/:campaignId/messages/:messageId`}
          component={Message}
        />
        <Route exact path={`/org/${organizationId}/domains`} component={Domains} />
        <Route exact path={`/org/${organizationId}/domains/:domainId`} component={Domain} />
        <Route exact path={`/org/${organizationId}/lists`} component={Lists} />
        <Route exact path={`/org/${organizationId}/lists/:listId`} component={List} />
        <Route exact path={`/org/${organizationId}/tags`} component={Tags} />
        <Route exact path={`/org/${organizationId}/tags/:tagId`} component={Tag} />
        <Route
          exact
          path={`/org/${organizationId}/suppression_lists`}
          component={SuppressionLists}
        />
        <Route
          exact
          path={`/org/${organizationId}/suppression_lists/:suppressionListId`}
          component={SuppressionList}
        />
        <Route
          exact
          path={`/org/${organizationId}/donation_imports`}
          component={BulkDonationImports}
        />
        <Route
          exact
          path={`/org/${organizationId}/submission_forms`}
          component={SubmissionForms}
        />
        <Route
          exact
          path={`/org/${organizationId}/submission_forms/:submissionFormId`}
          component={SubmissionForm}
        />
        <Route
          exact
          path={`/org/${organizationId}/welcome_messages`}
          component={WelcomeMessages}
        />
        <Route
          exact
          path={`/org/${organizationId}/welcome_messages/:welcomeMessageId`}
          component={WelcomeMessage}
        />
        <Route
          exact
          path={`/org/${organizationId}/lists/:listId/segments/:segmentId`}
          component={Segment}
        />
        <Route
          exact
          path={`/org/${organizationId}/lists/:listId/audiences/:audienceId`}
          component={Audience}
        />
        <Route exact path={`/org/${organizationId}/subscribers`} component={Subscribers} />
        <Route
          exact
          path={`/org/${organizationId}/subscribers/:subscriberId`}
          component={Subscriber}
        />
        <Route exact path={`/org/${organizationId}/users`} component={Users} />
        <Route exact path={`/org/${organizationId}/clients`} component={Clients} />
        <Route exact path={`/org/${organizationId}/clients/:clientId`} component={Client} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  organization: getActiveOrganization(state),
  organizations: getOrganizations(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  { setOrg: Actions.setOrg, showError: Actions.showError },
)(Organization);
