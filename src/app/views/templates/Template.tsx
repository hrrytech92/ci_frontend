import Form from 'app/base-classes/form/Form';
import { IOrganization } from 'app/definitions/organization';
import { IRedux } from 'app/definitions/redux';
import { ITemplate } from 'app/definitions/template';
import { formatDate } from 'app/helpers/date';
import { showSuccess } from 'app/state/notifications/actions';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import {
  fetchTemplates,
  addTemplate,
  deleteTemplate,
  editTemplate,
  enableTemplate,
} from 'app/state/templates/api';
import { getTemplate } from 'app/state/templates/selectors';
import EditTemplate from 'app/views/templates/EditTemplate';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Icon, Label, Menu, Segment } from 'semantic-ui-react';
import config from 'app/config';
import { getOrgApiUrl } from 'app/actions/url';
import ApplyTags from '../tags/ApplyTags';
import { ITag } from 'app/definitions/tag';
import { addTagToTemplate, fetchTags, addTag } from 'app/state/tags/api';

interface IMatch {
  templateId: string;
  organizationId: string;
}

interface IProps extends RouteComponentProps<IMatch> {
  organization?: IOrganization;
  template: ITemplate;
  addTag: (tag) => ITag;
  addTagToTemplate: (tag) => ITemplate;
  fetchTemplates: () => void;
  fetchTags: (id) => ITag[];
  enableTemplate: (a) => void;
  editTemplate: (a, b) => ITemplate;
  deleteTemplate: (a) => void;
  addTemplate: (a) => ITemplate;
  showSuccess?: (m) => void;
}

interface IState {
  edit: boolean;
}

class Template extends Form<IProps, IState> {
  state = {
    edit: false,
  };

  componentDidMount() {
    this.props.fetchTags(this.props.match.params.organizationId);
  }

  edit = () => {
    this.setState({ edit: true });
  };

  isNewTemplate = () => {
    return this.props.match.params.templateId === 'add';
  };

  handleSubmit = async template => {
    const { organization } = this.props;
    const { name, variables, html_template } = template;
    const updated = {
      name,
      variables,
      html_template,
    };

    if (this.isNewTemplate()) {
      const newTemplate = await this.props.addTemplate(updated);

      this.props.history.replace(`/org/${organization.id}/templates/${newTemplate.id}`);
    } else {
      await this.props.editTemplate(this.props.template.id, updated);
    }
    this.setState({ edit: false });
  };

  toggleDisable = async () => {
    const isDisabled = this.props.template.disabled;
    const templateId = this.props.match.params.templateId;
    const c = confirm(`${isDisabled ? 'Enable' : 'Disable'} this Template?`);
    if (c) {
      if (!isDisabled) {
        this.props.deleteTemplate(templateId);
      } else {
        this.props.enableTemplate(templateId);
      }
    }
  };

  handleClone = async () => {
    const { template, organization, showSuccess, addTemplate } = this.props;
    const newTemplate = await addTemplate({
      name: `${template.name} COPY`,
      variables: template.variables,
      html_template: template.html_template,
    });

    this.props.history.replace(`/org/${organization.id}/templates/${newTemplate.id}`);
    showSuccess('Template cloned');
    this.edit();
  };

  handleApplyTagSubmit = async tag => {
    this.props.template.tags.push(tag);
    this.props.editTemplate(this.props.template.id, this.props.template);
  };

  handleApplyTagEnter = async tag => {
    tag.org = this.props.match.params.organizationId;
    const t = await this.props.addTag(tag);
    this.handleApplyTagSubmit(t);
    this.props.fetchTags(this.props.match.params.organizationId);
  };

  handleRemoveTag = async id => {
    this.props.template.tags = this.props.template.tags.filter(tag => tag.id != id);
    this.props.editTemplate(this.props.template.id, this.props.template);
  };

  render() {
    let { template } = this.props;
    const previewUrl =
      config.API_URL +
      getOrgApiUrl('templates/' + this.props.match.params.templateId + '/preview');

    if (!template) {
      template = {
        html_template: '',
      } as ITemplate;
    }

    if (this.state.edit || this.isNewTemplate()) {
      return (
        <EditTemplate
          organization={this.props.organization}
          onSubmit={this.handleSubmit}
          initialValues={template}
          onCancel={() => this.setState({ edit: false })}
          template={template}
        />
      );
    }

    return (
      <div>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Header as="h3" data-test="templateName">
              {template.name} {template.disabled && <Label>Disabled</Label>}
            </Header>
          </Menu.Item>
          <Menu.Item position="right">
            {template.disabled ? (
              <Button
                color="green"
                onClick={this.toggleDisable}
                content="Enable Template"
                icon="check"
              />
            ) : (
              <Button onClick={this.toggleDisable} content="Disable Template" icon="ban" />
            )}
            &nbsp;
            <ApplyTags
              onSubmit={e => {
                this.handleApplyTagSubmit(e);
              }}
              onEnter={e => {
                this.handleApplyTagEnter(e);
              }}
              exclude={template.tags && template.tags.map(t => t.id)}
            />
            &nbsp;
            <Button
              color="green"
              onClick={this.handleClone}
              content="Clone Template"
              icon="file"
            />
            &nbsp;
            <Button color="green" onClick={this.edit} content="Edit" icon="pencil" />
            <a href={previewUrl} target="_blank">
              &nbsp;
              <Button color="blue" content="Preview" icon="external square alternate" />
            </a>
          </Menu.Item>
        </Menu>
        <p className="small">
          Created At: {formatDate(template.created_on)}
          <br />
          Last Updated: {formatDate(template.updated_on)}
        </p>
        <Segment>
          <div
            className="templateReset"
            dangerouslySetInnerHTML={{ __html: template.html_template }}
          />
        </Segment>
        <Header as="h3">Tags</Header>
        {template.tags && template.tags.length > 0 ? (
          <table className="ui selectable celled table">
            <thead>
              <tr>
                <th>Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {template.tags.map(tag => {
                return (
                  <tr
                    key={tag.id}
                    onClick={() => {
                      this.props.history.push(`/org/${this.props.organization.id}/tags/${tag.id}`);
                    }}
                  >
                    <td data-label="Name">{tag.name}</td>
                    <td
                      style={{
                        width: '50px',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        this.handleRemoveTag(tag.id);
                      }}
                    >
                      <Icon name="trash alternate" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No tags found for this template.</p>
        )}
      </div>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    template: getTemplate(state, parseInt(ownProps.match.params.templateId)),
    organization: getActiveOrganization(state),
  }),
  {
    addTag,
    addTagToTemplate,
    fetchTemplates,
    fetchTags,
    addTemplate,
    editTemplate,
    showSuccess,
    deleteTemplate,
    enableTemplate,
  },
)(Template);
