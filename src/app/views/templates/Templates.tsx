import { IRedux } from 'app/definitions/redux';
import { ITemplate } from 'app/definitions/template';
import { IPaginatedMeta } from 'app/definitions/api';
import { formatDateTime } from 'app/helpers/date';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { fetchTemplates } from 'app/state/templates/api';
import { getTemplatesForCurrentOrg, getTemplatesMeta } from 'app/state/templates/selectors';
import { values, isNull } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Header, Menu, Table, Label } from 'semantic-ui-react';

interface IProps extends RouteComponentProps<void> {
  templates?: ITemplate[];
  templatesMeta: IPaginatedMeta;
  fetchTemplates: typeof fetchTemplates;
  organization: any;
}

interface IState {
  activeTab: string;
}

class Templates extends React.Component<IProps, IState> {
  state: IState = {
    activeTab: 'active',
  };

  componentDidMount() {
    this.props.fetchTemplates();
  }

  loadMore = () => {
    this.props.fetchTemplates(this.props.templatesMeta.next);
  };

  get disabled() {
    return this.props.templates.filter(c => c.disabled).length;
  }

  get active() {
    return this.props.templates.filter(c => !c.disabled).length;
  }

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
  };

  render() {
    const { templates, history, match, templatesMeta } = this.props;
    const { activeTab } = this.state;

    const filteredTemplates = values(templates).filter(
      t => t.disabled === (activeTab === 'disabled'),
    );
    const showMore = !isNull(templatesMeta.next);

    return (
      <>
        <Header as="h2">Templates</Header>
        <Menu secondary className="noLeftPadding">
          <Menu.Item
            style={{ marginLeft: 0 }}
            name="active"
            active={activeTab === 'active'}
            onClick={this.handleTabClick}
          >
            Active <Label>{this.active}</Label>
          </Menu.Item>
          <Menu.Item
            name="disabled"
            active={activeTab === 'disabled'}
            onClick={this.handleTabClick}
          >
            Disabled <Label>{this.disabled}</Label>
          </Menu.Item>
          <Menu.Item position="right">
            <Button
              onClick={() => {
                this.props.history.push(`/org/${this.props.organization.id}/templates/add`);
              }}
              color="green"
              content="Add Template"
              icon="plus"
            />
          </Menu.Item>
        </Menu>

        <Table selectable className="bootstrapTableFix" basic="very" data-test="templateTable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell width={3}>Name</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Updated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredTemplates.map(template => {
              return (
                <Table.Row
                  key={template.id}
                  onClick={() => history.push(`${match.url}/${template.id}`)}
                >
                  <Table.Cell>{template.id}</Table.Cell>
                  <Table.Cell>{template.name}</Table.Cell>
                  <Table.Cell>{formatDateTime(template.created_on)}</Table.Cell>
                  <Table.Cell>{formatDateTime(template.updated_on)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMore && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button onClick={this.loadMore} fluid content="Load More" />
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    templates: getTemplatesForCurrentOrg(state),
    templatesMeta: getTemplatesMeta(state),
    organization: getActiveOrganization(state),
  }),
  {
    fetchTemplates,
  },
)(Templates);
