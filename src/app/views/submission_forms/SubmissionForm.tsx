import {
  saveSubmissionForm,
  fetchSubmissionForm,
  fetchWelcomeMessage,
} from 'app/state/submission-forms/api';
import { ISubmissionForm } from 'app/definitions/submissionForm';
import { getSubmissionForm, getSubmissionFormRelated } from 'app/state/submission-forms/selectors';
import EditSubmissionFormForm from 'app/views/submission_forms/EditSubmissionForm';
import { formatDateTime } from 'app/helpers/date';
import { IRedux } from 'app/definitions/redux';
import { get } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Menu, Table, Icon, Button } from 'semantic-ui-react';
import { fetchList } from 'app/state/lists/api';
import { isNull } from 'util';

interface IMatch {
  submissionFormId: number | 'new';
}

interface IProps extends RouteComponentProps<IMatch> {
  form: ISubmissionForm;
  formRelated: any;
  fetchList: typeof fetchList;
  fetchWelcomeMessage: typeof fetchWelcomeMessage;
  fetchSubmissionForm?: (a) => ISubmissionForm;
  saveSubmissionForm: (a) => ISubmissionForm;
}

interface IState {
  editing: boolean;
}

class SubmissionForm extends React.Component<IProps, IState> {
  state = {
    editing: false,
  };

  async componentDidMount() {
    const { submissionFormId } = this.props.match.params;
    if (!this.isNewForm()) {
      const form = await this.props.fetchSubmissionForm(submissionFormId);
      this.props.fetchList(form.list_subscription);
      if (!isNull(form.welcome_message)) {
        this.props.fetchWelcomeMessage(form.welcome_message);
      }
    }
  }

  isNewForm = () => {
    return this.props.match.params.submissionFormId === 'new';
  };

  handleCancel = e => {
    e.preventDefault();
    const submissionFormsUrl = this.props.history.location.pathname.replace('/new', '');
    if (this.isNewForm()) {
      this.props.history.push(submissionFormsUrl);
    } else {
      this.setState({ editing: false });
    }
  };

  handleSubmit = async values => {
    let updatedSubmissionForm;
    updatedSubmissionForm = await this.props.saveSubmissionForm(values);
    if (updatedSubmissionForm && updatedSubmissionForm.id) {
      this.props.history.push(String(updatedSubmissionForm.id));
      this.setState({ editing: false });
    }
  };

  render() {
    let { form, formRelated } = this.props;

    const { editing } = this.state;

    if (!form) {
      form = {} as ISubmissionForm;
    }

    return (
      <>
        {this.isNewForm() || editing ? (
          <EditSubmissionFormForm
            onSubmit={this.handleSubmit}
            initialValues={form}
            submissionForm={form}
            history={this.props.history}
            handleCancel={this.handleCancel}
          />
        ) : (
          <>
            <Menu secondary>
              <Menu.Item style={{ paddingLeft: 0 }}>
                <Header as="h3" data-test="messageHeader">
                  Name: {form.name}{' '}
                </Header>
              </Menu.Item>
              <Menu.Item position="right">
                <Button
                  content="Edit"
                  color="green"
                  icon="pencil"
                  onClick={() => this.setState({ editing: true })}
                />
              </Menu.Item>
            </Menu>
            <Table className="bootstrapTableFix" definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Subscription List</Table.Cell>
                  <Table.Cell>
                    <a href={get(formRelated, 'listUrl', '')}>
                      {get(formRelated, 'list.id', '')} - {get(formRelated, 'list.list_name', '')}
                    </a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Send Welcome Message</Table.Cell>
                  <Table.Cell>
                    {form.send_email ? <Icon name="check square" /> : <Icon name="ban" />}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Welcome Message</Table.Cell>
                  <Table.Cell>
                    <a href={get(formRelated, 'welcomeMessageUrl', '')}>
                      {get(formRelated, 'welcomeMessage.id', '')} -{' '}
                      {get(formRelated, 'welcomeMessage.name', '')}
                    </a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Allowed Fields</Table.Cell>
                  <Table.Cell>{get(form, 'allowed_fields', []).join(', ')}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Key</Table.Cell>
                  <Table.Cell>{form.key}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Created At</Table.Cell>
                  <Table.Cell>{formatDateTime(form.created_at)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Updated At</Table.Cell>
                  <Table.Cell>{formatDateTime(form.updated_at)}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        )}
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux, ownProps: RouteComponentProps<IMatch>) => ({
    form: getSubmissionForm(state, ownProps.match.params.submissionFormId),
    formRelated: getSubmissionFormRelated(state, ownProps.match.params.submissionFormId),
  }),
  {
    saveSubmissionForm,
    fetchSubmissionForm,
    fetchList,
    fetchWelcomeMessage,
  },
)(SubmissionForm);
