import Header from 'app/components/header/Header';
import Sidebar from 'app/components/sidebar/Sidebar';
import OrganizationContainer from 'app/containers/organization/Organization';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { loadBootstrapData } from 'app/state/bootstrap/api';
import { setOrg } from 'app/state/organizations/actions';
import { getOrgDetail } from 'app/state/organizations/api';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import Home from 'app/views/home/Home';
import Organization from 'app/views/organizations/Organization';
import Organizations from 'app/views/organizations/Organizations';
import Profile from 'app/views/profile/Profile';
import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

interface IProps extends RouteComponentProps<any> {
  loadBootstrapData(): void;
  getOrgDetail(id: string): Promise<IOrganization>;
  organization: IOrganization;
  setOrg(id: string): void;
}

class Dashboard extends React.Component<IProps> {
  componentDidUpdate(prevProps) {
    const { organization } = this.props;

    // initial load (after componentDidMount)
    if (!prevProps.organization && organization) {
      this.props.loadBootstrapData();
      this.props.getOrgDetail(organization.id);
    }

    const hasOrgs = get(organization, 'id') && prevProps.organization;
    const orgHasChanged = hasOrgs && prevProps.organization.id !== get(organization, 'id');

    if (orgHasChanged) {
      this.props.getOrgDetail(organization.id).then(() => {
        this.props.loadBootstrapData();
      });
    }
  }

  public render() {
    const { location, organization } = this.props;
    const classes = !!organization ? 'pusherContent' : 'pusherContentWide';
    return (
      <div className="app">
        {/*
          // @ts-ignore */}
        <Header {...this.props} />
        <div className="appBody">
          <Sidebar location={location}>
            <div className={classes}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/organizations" component={Organizations} />
                <Route exact path="/organizations/:organizationId" component={Organization} />
                <Route path="/org/:organizationId" component={OrganizationContainer} />
                <Redirect exact path="/*" to="/" />
              </Switch>
            </div>
          </Sidebar>
        </div>
      </div>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    organization: getActiveOrganization(state),
  }),
  {
    setOrg,
    getOrgDetail,
    loadBootstrapData,
  },
)(Dashboard);
