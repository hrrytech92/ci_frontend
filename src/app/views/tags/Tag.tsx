import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ITag } from 'app/definitions/tag';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { getTag } from 'app/state/tags/selector';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Menu } from 'semantic-ui-react';
import {
  editTag,
  deleteTag,
  fetchTags,
  fetchTemplatesForTag,
  fetchMessagesForTag,
} from '../../state/tags/api';
import EditTag from './EditTag';

interface IMatch {
  tagId: string;
  organizationId: string;
}
interface IProps extends RouteComponentProps<IMatch> {
  tag?: ITag;
  organization?: IOrganization;
  deleteTag: (id: number) => Promise<void>;
  editTag: (tag: ITag) => Promise<ITag>;
  fetchTags: () => Promise<ITag[]>;
  fetchTemplatesForTag: typeof fetchTemplatesForTag;
  fetchMessagesForTag: typeof fetchMessagesForTag;
}

class Tag extends React.Component<IProps> {
  componentDidMount() {
    this.props.fetchTags();
  }

  handleTagSubmit(tag) {
    this.props.editTag(tag).then(response => {
      this.props.fetchTags();
    });
  }

  handleTagDelete() {
    if (confirm('Are you sure?')) {
      this.props.deleteTag(this.props.tag.id).then(response => {
        this.props.history.push(`/org/${this.props.organization.id}/tags`);
      });
    }
  }

  render() {
    return (
      <>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            {!this.props.tag || (
              <Header key={this.props.tag.name} as="h3">
                {this.props.tag.name}
              </Header>
            )}
          </Menu.Item>
          <Menu.Item position="right">
            <Button
              color="red"
              onClick={() => {
                this.handleTagDelete();
              }}
            >
              Delete
            </Button>
            &nbsp;
            {!this.props.tag || (
              <EditTag
                tag={this.props.tag}
                onSubmit={e => {
                  console.log(e);
                  this.handleTagSubmit(e);
                }}
              />
            )}
          </Menu.Item>
        </Menu>
        {!this.props.tag || (
          <div>
            <Header as="h3">Templates ({this.props.tag.templates.length})</Header>
            <table className="ui selectable celled table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tag.templates.map(template => {
                  return (
                    <tr
                      key={template.id}
                      onClick={() => {
                        this.props.history.push(
                          `/org/${this.props.organization.id}/templates/${template.id}`,
                        );
                      }}
                    >
                      <td data-label="Name">{template.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Header as="h3">Messages ({this.props.tag.messages.length})</Header>
            <table className="ui selectable celled table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tag.messages.map(message => {
                  return (
                    <tr
                      key={message.id}
                      onClick={() => {
                        this.props.history.push(
                          `/org/${this.props.organization.id}/messages/${message.id}`,
                        );
                      }}
                    >
                      <td data-label="Name">{message.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    tag: getTag(state, parseInt(ownProps.match.params.tagId)),
    organization: getActiveOrganization(state),
  }),
  {
    deleteTag,
    editTag,
    fetchTags,
    fetchTemplatesForTag,
    fetchMessagesForTag,
  },
)(Tag);
