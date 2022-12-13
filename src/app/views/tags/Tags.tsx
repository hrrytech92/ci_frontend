import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ITag } from 'app/definitions/tag';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { getTagsForCurrentOrg } from 'app/state/tags/selector';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu } from 'semantic-ui-react';
import { addTag, fetchTags } from '../../state/tags/api';
import AddTag from './AddTag';

interface IMatch {
  organizationId: string;
}
interface IProps extends RouteComponentProps<IMatch> {
  organization?: IOrganization;
  tags?: ITag[];
  fetchTags: typeof fetchTags;
  addTag(tag: ITag): Promise<ITag>;
}

interface IState {
  organization: IOrganization;
}

class Tags extends React.Component<IProps, IState> {
  state: IState = {
    organization: {} as IOrganization,
  };

  async componentDidMount() {
    this.props.fetchTags();
  }

  handleTagSubmit = async (data: { name: string }) => {
    await this.props.addTag({
      name: data.name,
      org: this.state.organization.id,
    });

    this.props.fetchTags();
  };

  render() {
    return (
      <>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Header as="h3">Tags</Header>
          </Menu.Item>
          <Menu.Item position="right" />
          <AddTag
            onSubmit={e => {
              console.log(e);
              this.handleTagSubmit(e);
            }}
          />
        </Menu>
        {this.props.tags ? (
          <table className="ui selectable celled table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Templates</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              {this.props.tags.map(tag => {
                return (
                  <tr
                    key={tag.id}
                    onClick={e => {
                      this.props.history.push(`/org/${this.props.organization.id}/tags/${tag.id}`);
                    }}
                  >
                    <td style={{ width: '50px' }} data-label="ID">
                      {tag.id}
                    </td>
                    <td data-label="Name">{tag.name}</td>
                    <td style={{ width: '85px' }} data-label="Templates">
                      {tag.templates.length}
                    </td>
                    <td style={{ width: '85px' }} data-label="Messages">
                      {tag.messages.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No tags found for this organization.</p>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    tags: getTagsForCurrentOrg(state),
    organization: getActiveOrganization(state),
  }),
  {
    addTag,
    fetchTags,
  },
)(Tags);
