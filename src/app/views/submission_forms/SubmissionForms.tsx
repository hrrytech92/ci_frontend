import { ISubmissionForm } from 'app/definitions/submissionForm';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { formatDateTime } from 'app/helpers/date';
import {
  saveSubmissionForm,
  fetchSubmissionForms,
  deleteSubmissionForm,
} from 'app/state/submission-forms/api';
import { getSubmissionForms, getSubmissionFormsMeta } from 'app/state/submission-forms/selectors';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Button } from 'semantic-ui-react';
import { isNull } from 'lodash';

interface IProps extends RouteComponentProps<void> {
  submissionForms?: ISubmissionForm[];
  submissionFormsMeta: IPaginatedMeta;
  fetchSubmissionForms: typeof fetchSubmissionForms;
  saveSubmissionForm(ISubmissionForm): void;
  deleteSubmissionForm(submissionFormId): void;
}

class SubmissionForms extends React.Component<IProps> {
  loadMoreSubmissionForms = () => {
    this.props.fetchSubmissionForms(this.props.submissionFormsMeta.next);
  };
  deleteForm = async submissionFormId => {
    const c = confirm('Delete this Form?');
    if (c) {
      await this.props.deleteSubmissionForm(submissionFormId);
    }
  };
  handleAddNew = () => {
    this.props.history.push(`${this.props.match.url}/new`);
  };
  render() {
    const { submissionForms, submissionFormsMeta, match, history } = this.props;
    const showMoreSubmissionForms = !isNull(submissionFormsMeta.next);
    return (
      <>
        <Header as="h2">Signup Forms</Header>
        <Menu secondary>
          <Menu.Item position="right">
            <Button onClick={this.handleAddNew} color="green" icon="plus" content="Add Form" />
          </Menu.Item>
        </Menu>
        <Table selectable className="bootstrapTableFix" data-test="listsTable" basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Updated At</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {submissionForms.map(sf => {
              return (
                <Table.Row key={sf.id}>
                  <Table.Cell onClick={() => history.push(`${match.url}/${sf.id}`)}>
                    {sf.id}
                  </Table.Cell>
                  <Table.Cell onClick={() => history.push(`${match.url}/${sf.id}`)}>
                    {sf.name}
                  </Table.Cell>
                  <Table.Cell onClick={() => history.push(`${match.url}/${sf.id}`)}>
                    {formatDateTime(sf.created_at)}
                  </Table.Cell>
                  <Table.Cell onClick={() => history.push(`${match.url}/${sf.id}`)}>
                    {formatDateTime(sf.updated_at)}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        this.deleteForm(sf.id);
                      }}
                      color="red"
                      icon="ban"
                      content="Delete"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          {showMoreSubmissionForms && (
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Button onClick={this.loadMoreSubmissionForms} fluid content="Load More" />
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  submissionForms: getSubmissionForms(state),
  submissionFormsMeta: getSubmissionFormsMeta(state),
});

export default connect<{}, {}>(
  mapStateToProps,
  {
    saveSubmissionForm,
    fetchSubmissionForms,
    deleteSubmissionForm,
  },
)(SubmissionForms);
