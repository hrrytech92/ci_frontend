import { IWelcomeMessage } from 'app/definitions/submissionForm';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { getDomainOptions, getDomainsMeta } from 'app/state/domains/selectors';
import { getTemplateOptions, getTemplatesMeta } from 'app/state/templates/selectors';
import { fetchDomains } from 'app/state/domains/api';
import { fetchTemplates } from 'app/state/templates/api';
import {
  ReduxFormDropdown,
  ReduxFormInput,
  required,
  ReduxFormDropdownInput,
  ReduxFormVariables,
} from 'app/views/messages/ReduxFormInput';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, formValueSelector } from 'redux-form';
import { DropdownItemProps, Form, Button, Dropdown } from 'semantic-ui-react';
import { concat, find } from 'lodash';

interface EditWelcomeMessageFormProps {
  welcomeMessage: IWelcomeMessage;
}

type ConnectProps = {
  senderEmail: string;
  handleCancel(): void;
  templatesMeta: IPaginatedMeta;
  domainsMeta: IPaginatedMeta;
  fetchDomains: typeof fetchDomains;
  fetchTemplates: typeof fetchTemplates;
  domainOptions: DropdownItemProps[];
  templateOptions: DropdownItemProps[];
};

type CombinedProps = EditWelcomeMessageFormProps & ConnectProps & InjectedFormProps;

class EditWelcomeMessageForm extends React.Component<CombinedProps> {
  loadMoreDomains = e => {
    e.preventDefault();
    this.props.fetchDomains(this.props.domainsMeta.next);
  };

  loadMoreTemplates = e => {
    e.preventDefault();
    this.props.fetchTemplates(this.props.templatesMeta.next);
  };

  handleDomainChange = (e, { value }) => {
    const { change, senderEmail } = this.props;
    change('domain', value);
    change('sender_email', this.formatEmail(senderEmail.replace(/@.+/, ''), value));
  };

  getDomainOption = domainId => {
    return find(this.props.domainOptions, { value: domainId }) as DropdownItemProps;
  };
  formatEmail = (value, domainId: number) => {
    return `${value}@${this.getDomainOption(domainId).text}`;
  };

  render() {
    let {
      welcomeMessage,
      handleSubmit,
      submitting,
      invalid,
      domainOptions,
      domainsMeta,
      templateOptions,
      templatesMeta,
    } = this.props;

    let paginatedDomainOptions;
    let paginatedTemplateOptions;

    const moreDomains = domainsMeta.next && domainsMeta.count > domainOptions.length;
    const moreTemplates = templatesMeta.next && templatesMeta.count > domainOptions.length;

    if (moreDomains) {
      paginatedDomainOptions = concat(domainOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreDomains} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedDomainOptions = domainOptions;
    }

    if (moreTemplates) {
      paginatedTemplateOptions = concat(templateOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreTemplates} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedTemplateOptions = templateOptions;
    }

    return (
      <Form onSubmit={handleSubmit} data-test="editWelcomeMessageForm">
        <Form.Group widths="equal">
          <Field
            name="name"
            validate={[required]}
            component={ReduxFormInput}
            label="Message Name"
            autoFocus
          />
          <Field name="subject" component={ReduxFormInput} label="Subject" />
        </Form.Group>
        <Form.Group widths="equal">
          <Field name="sender_name" component={ReduxFormInput} label="Sender Name" />
          {/*
          // @ts-ignore */}
          <Field
            label="Sender Email"
            name="sender_email"
            format={v => {
              if (v) {
                return v.replace(/@.+/, '');
              }
            }}
            normalize={(value, previous, allValues) => {
              return this.formatEmail(value, allValues.domain);
            }}
            component={ReduxFormDropdownInput}
            dropdownLabel={
              <Dropdown
                key={welcomeMessage.domain}
                selectOnNavigation={false}
                defaultValue={welcomeMessage.domain}
                onChange={this.handleDomainChange}
                options={paginatedDomainOptions}
              />
            }
            labelPosition="right"
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            data-test="template"
            label="Template"
            name="template"
            component={ReduxFormDropdown}
            options={paginatedTemplateOptions}
          />
        </Form.Group>
        <Field name="variables" component={ReduxFormVariables} />

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

const ReduxEditWelcomeMessageForm = reduxForm({ form: 'editWelcomeMessage' })(
  EditWelcomeMessageForm,
);
const formSelector = formValueSelector('editWelcomeMessage');

export default connect<any, any, $FixMe>(
  (state: IRedux) => {
    return {
      senderEmail: formSelector(state, 'sender_email'),
      domainOptions: getDomainOptions(state),
      domainsMeta: getDomainsMeta(state),
      templateOptions: getTemplateOptions(state),
      templatesMeta: getTemplatesMeta(state),
    };
  },
  {
    fetchDomains,
    fetchTemplates,
  },
)(ReduxEditWelcomeMessageForm);
