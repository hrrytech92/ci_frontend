import { IMessage } from 'app/definitions/message';
import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { getDomainOptions, getDomainsMeta } from 'app/state/domains/selectors';
import { getAudienceOptions, getAudiencesMeta } from 'app/state/audiences/selectors';
import { getListOptions, getListsMeta } from 'app/state/lists/selectors';
import { fetchLists } from 'app/state/lists/api';
import { fetchAudiences } from 'app/state/audiences/api';
import { getSeedListOptions } from 'app/state/seed-lists/selectors';
import {
  getSuppressionListOptions,
  getSuppressionListsMeta,
} from 'app/state/suppression-lists/selectors';
import { fetchSuppressionLists } from 'app/state/suppression-lists/api';
import { fetchListSegments } from 'app/state/segments/api';
import { getSegmentOptions, getListSegmentsMeta } from 'app/state/segments/selectors';
import { fetchDomains } from 'app/state/domains/api';
import { fetchTemplates } from 'app/state/templates/api';
import {
  getTemplateHTML,
  getTemplateOptions,
  getTemplatesMeta,
} from 'app/state/templates/selectors';
import {
  ReduxFormDropdown,
  ReduxFormDropdownInput,
  ReduxFormInput,
  ReduxFormVariables,
  required,
} from 'app/views/messages/ReduxFormInput';
import { find } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';
import { Dropdown, DropdownItemProps, Form, Button } from 'semantic-ui-react';
import { concat } from 'lodash';
import './messageForm.scss';

interface EditMessageFormProps {
  campaignId: number;
  message: IMessage;
}

type ConnectProps = {
  senderEmail: string;
  templateHTML: string;
  handleCancel(): void;
  fetchListSegments: (listId?: number, url?: string) => void;
  fetchAudiences: (listId?: number, url?: string) => void;
  listSegmentsMeta: IPaginatedMeta;
  domainsMeta: IPaginatedMeta;
  listsMeta: IPaginatedMeta;
  templatesMeta: IPaginatedMeta;
  audiencesMeta: IPaginatedMeta;
  suppressionListsMeta: IPaginatedMeta;
  fetchSuppressionLists: typeof fetchSuppressionLists;
  fetchDomains: typeof fetchDomains;
  fetchLists: typeof fetchLists;
  fetchTemplates: typeof fetchTemplates;
  listOptions: DropdownItemProps[];
  segmentOptions: DropdownItemProps[];
  audienceOptions: DropdownItemProps[];
  seedListOptions: DropdownItemProps[];
  domainOptions: DropdownItemProps[];
  templateOptions: DropdownItemProps[];
  suppressionListOptions: DropdownItemProps[];
};

type CombinedProps = EditMessageFormProps & ConnectProps & InjectedFormProps;

class EditMessageForm extends React.Component<CombinedProps> {
  handleListChange = (e, value) => {
    this.props.fetchListSegments(value);
  };

  handleDomainChange = (e, { value }) => {
    const { change, senderEmail } = this.props;
    change('domain', value);
    change('sender_email', this.formatEmail(senderEmail.replace(/@.+/, ''), value));
  };

  handleAudienceChange = (e, { value }) => {
    const { change } = this.props;
    change('segment', null);
  };
  handleSegmentChange = (e, { value }) => {
    const { change } = this.props;
    change('audience', null);
  };
  loadMoreSuppressionLists = e => {
    e.preventDefault();
    this.props.fetchSuppressionLists(this.props.suppressionListsMeta.next);
  };
  loadMoreDomains = e => {
    e.preventDefault();
    this.props.fetchDomains(this.props.domainsMeta.next);
  };
  loadMoreLists = e => {
    e.preventDefault();
    this.props.fetchLists(this.props.listsMeta.next);
  };
  loadMoreTemplates = e => {
    e.preventDefault();
    this.props.fetchTemplates(this.props.templatesMeta.next);
  };
  loadMoreListSegments = e => {
    e.preventDefault();
    this.props.fetchListSegments(null, this.props.listSegmentsMeta.next);
  };
  loadMoreAudiences = e => {
    e.preventDefault();
    this.props.fetchAudiences(null, this.props.audiencesMeta.next);
  };
  getDomainOption = domainId => {
    return find(this.props.domainOptions, { value: domainId }) as DropdownItemProps;
  };

  formatEmail = (value, domainId: number) => {
    return `${value}@${this.getDomainOption(domainId).text}`;
  };

  render() {
    let {
      message,
      handleSubmit,
      submitting,
      invalid,
      domainOptions,
      domainsMeta,
      listOptions,
      listsMeta,
      templatesMeta,
      templateOptions,
      segmentOptions,
      audienceOptions,
      audiencesMeta,
      listSegmentsMeta,
      suppressionListOptions,
      suppressionListsMeta,
    } = this.props;
    domainsMeta;
    let paginatedDomainOptions;
    let paginatedListOptions;
    let paginatedTemplateOptions;
    let paginatedSegmentOptions;
    let paginatedAudienceOptions;
    let paginatedSuppressionListOptions;

    const moreTemplates = templatesMeta.next && templatesMeta.count > templateOptions.length;
    const moreDomains = domainsMeta.next && domainsMeta.count > domainOptions.length;
    const moreLists = listsMeta.next && listsMeta.count > listOptions.length;
    const moreAudiences = audiencesMeta.next && audiencesMeta.count > audienceOptions.length;
    const moreSegments = listSegmentsMeta.next && listSegmentsMeta.count > segmentOptions.length;
    const moreSuppressionLists =
      suppressionListsMeta.next && suppressionListsMeta.count > suppressionListOptions.length;

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
    if (moreAudiences) {
      paginatedAudienceOptions = concat(audienceOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreAudiences} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedAudienceOptions = audienceOptions;
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

    if (moreSegments) {
      paginatedSegmentOptions = concat(segmentOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreListSegments} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedSegmentOptions = segmentOptions;
    }
    if (moreSuppressionLists) {
      paginatedSuppressionListOptions = concat(suppressionListOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreSuppressionLists} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedSuppressionListOptions = suppressionListOptions;
    }
    return (
      <Form onSubmit={handleSubmit} data-test="editMessageForm">
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
                key={message.domain}
                selectOnNavigation={false}
                defaultValue={message.domain}
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
            label="Template Name"
            validate={[required]}
            name="template"
            component={ReduxFormDropdown}
            options={paginatedTemplateOptions}
          />
          <Field
            data-test="list"
            label="List"
            name="list"
            onChange={this.handleListChange}
            component={ReduxFormDropdown}
            validate={[required]}
            options={paginatedListOptions}
          />
          <Field
            data-test="segment"
            label="Segment"
            // validate={[required]}
            onChange={this.handleSegmentChange}
            name="segment"
            component={ReduxFormDropdown}
            options={paginatedSegmentOptions}
          />
          <Field
            data-test="audience"
            label="Audience"
            // validate={[required]}
            onChange={this.handleAudienceChange}
            name="audience"
            component={ReduxFormDropdown}
            options={paginatedAudienceOptions}
          />
          <Field
            data-test="seedlists"
            label="Seed Lists"
            name="seed_lists"
            component={ReduxFormDropdown}
            multiple
            options={this.props.seedListOptions}
          />
          <Field
            data-test="suppressionlists"
            label="Suppression Lists"
            name="suppression_lists"
            component={ReduxFormDropdown}
            multiple
            options={paginatedSuppressionListOptions}
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
          <Form.Button
            disabled={!this.props.templateHTML}
            onClick={e => {
              e.preventDefault();
              let newWindow = window.open();
              newWindow.document.write(this.props.templateHTML);
            }}
            content="Preview Template"
          />

          <Form.Button onClick={this.props.handleCancel} content="Cancel" />
        </Form.Group>
      </Form>
    );
  }
}

const ReduxEditMessageForm = reduxForm({ form: 'editMessage' })(EditMessageForm);
const formSelector = formValueSelector('editMessage');

export default connect<any, any, $FixMe>(
  (state: IRedux) => {
    const templateId = formSelector(state, 'template');
    const listId = formSelector(state, 'list');

    return {
      senderEmail: formSelector(state, 'sender_email'),
      listOptions: getListOptions(state),
      seedListOptions: getSeedListOptions(state),
      segmentOptions: getSegmentOptions(state, listId),
      audienceOptions: getAudienceOptions(state, listId),
      domainOptions: getDomainOptions(state),
      templateOptions: getTemplateOptions(state),
      suppressionListOptions: getSuppressionListOptions(state),
      templateHTML: getTemplateHTML(state, templateId),
      domainsMeta: getDomainsMeta(state),
      listsMeta: getListsMeta(state),
      templatesMeta: getTemplatesMeta(state),
      listSegmentsMeta: getListSegmentsMeta(state),
      audiencesMeta: getAudiencesMeta(state),
      suppressionListsMeta: getSuppressionListsMeta(state),
    };
  },
  {
    fetchListSegments,
    fetchDomains,
    fetchLists,
    fetchTemplates,
    fetchSuppressionLists,
    fetchAudiences,
  },
)(ReduxEditMessageForm);
