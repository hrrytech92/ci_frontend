import { ISubmissionForm } from 'app/definitions/submissionForm';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { getListOptions, getListsMeta } from 'app/state/lists/selectors';
import { fetchLists } from 'app/state/lists/api';
import {
  getWelcomeMessageOptions,
  getWelcomeMessagesMeta,
} from 'app/state/submission-forms/selectors';
import { fetchWelcomeMessages } from 'app/state/submission-forms/api';
import { ReduxFormDropdown, ReduxFormInput, required } from 'app/views/messages/ReduxFormInput';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { DropdownItemProps, Form, Button, Checkbox } from 'semantic-ui-react';
import { concat, isBoolean } from 'lodash';

function SendWelcomeEmailInput({ input }) {
  const { value, onChange } = input;
  return (
    <div className="field">
      <Checkbox
        toggle
        checked={isBoolean(value) ? value : false}
        label="Send Welcome Email"
        onChange={(e, { checked }) => {
          onChange(checked);
        }}
      />
    </div>
  );
}

interface EditSubmissionFormFormProps {
  submissionForm: ISubmissionForm;
}

type ConnectProps = {
  handleCancel(): void;
  listsMeta: IPaginatedMeta;
  welcomeMessagesMeta: IPaginatedMeta;
  fetchLists: typeof fetchLists;
  fetchWelcomeMessages: typeof fetchWelcomeMessages;
  listOptions: DropdownItemProps[];
  welcomeMessageOptions: DropdownItemProps[];
};

type CombinedProps = EditSubmissionFormFormProps & ConnectProps & InjectedFormProps;

class EditSubmissionFormForm extends React.Component<CombinedProps> {
  loadMoreLists = e => {
    e.preventDefault();
    this.props.fetchLists(this.props.listsMeta.next);
  };

  loadMoreWelcomeMessages = e => {
    e.preventDefault();
    this.props.fetchWelcomeMessages(this.props.welcomeMessagesMeta.next);
  };

  formatAllowedFields = values => (values ? values.join(', ') : '');
  parseAllowedFields = values => values.split(',').map(x => x.trim());

  render() {
    let {
      handleSubmit,
      submitting,
      invalid,
      listOptions,
      listsMeta,
      welcomeMessageOptions,
      welcomeMessagesMeta,
    } = this.props;

    let paginatedListOptions;
    let paginatedWelcomeMessageOptions;

    const moreLists = listsMeta.next && listsMeta.count > listOptions.length;
    const moreWelcomeMessages =
      welcomeMessagesMeta.next && welcomeMessagesMeta.count > listOptions.length;

    if (moreLists) {
      paginatedListOptions = concat(listOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreLists} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedListOptions = listOptions;
    }

    if (moreWelcomeMessages) {
      paginatedWelcomeMessageOptions = concat(welcomeMessageOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreWelcomeMessages} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedWelcomeMessageOptions = welcomeMessageOptions;
    }

    return (
      <Form onSubmit={handleSubmit} data-test="editSubmissionFormForm">
        <Form.Group widths="equal">
          <Field
            name="name"
            validate={[required]}
            component={ReduxFormInput}
            label="Form Name"
            autoFocus
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            data-test="list_subscription"
            label="List"
            name="list_subscription"
            component={ReduxFormDropdown}
            validate={[required]}
            options={paginatedListOptions}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Field
            label="Allowed Fields"
            placeholder="Allowed Fields"
            name="allowed_fields"
            component={ReduxFormInput}
            labelPosition="right"
            format={this.formatAllowedFields}
            normalize={this.parseAllowedFields}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field label="Send Welcome Email" name="send_email" component={SendWelcomeEmailInput} />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            data-test="welcome_message"
            label="Welcome Message"
            name="welcome_message"
            component={ReduxFormDropdown}
            options={paginatedWelcomeMessageOptions}
          />
        </Form.Group>

        <Form.Group floated="right">
          <Form.Button
            disabled={invalid || submitting}
            type="Submit"
            color="green"
            content={`${submitting ? 'Saving' : 'Save'}`}
          />
          <Form.Button onClick={this.props.handleCancel} content="Cancel" />
        </Form.Group>
      </Form>
    );
  }
}

const ReduxEditSubmissionFormForm = reduxForm({ form: 'editSubmissionForm' })(
  EditSubmissionFormForm,
);

export default connect<any, any, $FixMe>(
  (state: IRedux) => {
    return {
      listOptions: getListOptions(state),
      listsMeta: getListsMeta(state),
      welcomeMessageOptions: getWelcomeMessageOptions(state),
      welcomeMessagesMeta: getWelcomeMessagesMeta(state),
    };
  },
  {
    fetchLists,
    fetchWelcomeMessages,
  },
)(ReduxEditSubmissionFormForm);
