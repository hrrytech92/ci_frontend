import { logoutUser } from 'app/actions/userActions';
import { NormalizedResults } from 'app/definitions/api';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { loadBootstrapData } from 'app/state/bootstrap/api';
import { setOrg } from 'app/state/organizations/actions';
import { getOrgDetail } from 'app/state/organizations/api';
import { getActiveOrganization, getOrganizations } from 'app/state/organizations/selectors';
import { values } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Dropdown, Image, Menu } from 'semantic-ui-react';

interface ConnectedProps extends RouteComponentProps<any> {
  setOrg(string): void;
  organization: IOrganization;
  organizations?: NormalizedResults<IOrganization>;
  logoutUser?: () => void;
  getOrgDetail?: (i) => Promise<IOrganization>;
  loadBootstrapData(): void;
}
const MENU_STYLE = { maxHeight: '500px', overflowY: 'scroll' };

class Header extends React.Component<ConnectedProps> {
  onOrgSelect = (org: IOrganization) => {
    this.props.history.push(`/organizations/${org.id}`);
    this.props.setOrg(org.id);
    this.props.getOrgDetail(org.id);
  };

  render() {
    const { organizations, organization } = this.props;
    const isActive = this.props.location.pathname.includes('organizations');
    const buttonText = (organization && organization.account_name) || 'More';

    return (
      <Menu borderless style={{ margin: '0' }} fixed={'top'}>
        <Menu.Item
          as="a"
          onClick={e => {
            e.preventDefault();
            this.props.history.push('/');
          }}
          header
          data-test="organization-logo"
        >
          <Image size="medium" src="/app/images/ci_logo.png" />
        </Menu.Item>
        <Menu.Item
          icon="users"
          as={Link}
          to="/organizations"
          active={isActive}
          content="Organizations"
        />
        <Menu.Item position="right" data-test="headerMoreDropdown">
          <Dropdown text={buttonText} pointing="top right">
            <Dropdown.Menu style={MENU_STYLE}>
              <Dropdown.Item
                onClick={() => this.props.history.push('/profile')}
                icon="user"
                text="Profile"
              />
              <Dropdown.Item onClick={this.props.logoutUser} icon="power off" text="Logout" />
              <Dropdown.Divider />
              <Dropdown.Header>Organizations</Dropdown.Header>
              {values(organizations).map((org, i) => (
                <Dropdown.Item
                  onClick={() => this.onOrgSelect(org)}
                  key={i}
                  text={org.account_name}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    organization: getActiveOrganization(state),
    organizations: getOrganizations(state),
  }),
  {
    setOrg,
    loadBootstrapData,
    getOrgDetail,
    logoutUser,
  },
)(Header);
