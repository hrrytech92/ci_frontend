import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { Location } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import './sidebar.scss';

interface IProps {
  location: Location;
  organization: IOrganization;
}

function SidebarItem({ active, children, icon, link }) {
  return (
    <Menu.Item active={active} as={Link} to={link}>
      <Icon name={icon} />
      {children}
    </Menu.Item>
  );
}

class SidebarContainer extends React.Component<IProps> {
  public isActive(name: string) {
    return this.props.location.pathname.includes(name);
  }
  public render() {
    const { organization } = this.props;
    const orgId = organization ? organization.id : null;

    return (
      <Sidebar.Pushable>
        <Sidebar
          data-test="sidebar"
          className="sidebarMenuOverride"
          as={Menu}
          animation="push"
          inverted
          vertical
          visible={!!organization}
          width="thin"
          fixed="left"
        >
          <SidebarItem
            active={this.isActive(`organizations/${orgId}`)}
            icon="building"
            link={`/organizations/${orgId}`}
          >
            Org Details
          </SidebarItem>
          <SidebarItem
            active={this.isActive('campaigns')}
            icon="bandcamp"
            link={`/org/${orgId}/campaigns`}
          >
            Campaigns
          </SidebarItem>
          <SidebarItem active={this.isActive('users')} icon="user" link={`/org/${orgId}/users`}>
            Users
          </SidebarItem>
          <SidebarItem
            active={this.isActive('clients')}
            icon="user"
            link={`/org/${orgId}/clients`}
          >
            Clients
          </SidebarItem>
          <SidebarItem
            active={this.isActive('lists') && !this.isActive('suppression_lists')}
            icon="list"
            link={`/org/${orgId}/lists`}
          >
            Lists
          </SidebarItem>
          <SidebarItem
            active={this.isActive('suppression_lists')}
            icon="ban"
            link={`/org/${orgId}/suppression_lists`}
          >
            Supp. Lists
          </SidebarItem>
          <SidebarItem
            active={this.isActive('subscribers')}
            icon="user plus"
            link={`/org/${orgId}/subscribers`}
          >
            Subscribers
          </SidebarItem>
          <SidebarItem
            active={this.isActive('domains')}
            icon="globe"
            link={`/org/${orgId}/domains`}
          >
            Domains
          </SidebarItem>
          <SidebarItem active={this.isActive('tags')} icon="users" link={`/org/${orgId}/tags`}>
            Tags
          </SidebarItem>
          <SidebarItem active={this.isActive('teams')} icon="users" link={`/org/${orgId}/teams`}>
            Teams
          </SidebarItem>
          <SidebarItem
            active={this.isActive('templates')}
            icon="mail"
            link={`/org/${orgId}/templates`}
          >
            Templates
          </SidebarItem>
          <SidebarItem
            active={this.isActive('welcome_messages')}
            icon="play"
            link={`/org/${orgId}/welcome_messages`}
          >
            Welcome Messages
          </SidebarItem>
          <SidebarItem
            active={this.isActive('submission_forms')}
            icon="clipboard"
            link={`/org/${orgId}/submission_forms`}
          >
            Forms
          </SidebarItem>
          <SidebarItem
            active={this.isActive('donation_imports')}
            icon="clipboard"
            link={`/org/${orgId}/donation_imports`}
          >
            Donation Imports
          </SidebarItem>
        </Sidebar>

        <Sidebar.Pusher>{this.props.children}</Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  organization: getActiveOrganization(state),
});

export default connect(mapStateToProps)(SidebarContainer);
