import { IRedux } from 'app/definitions/redux';
import { IPaginatedMeta } from 'app/definitions/api';
import { getListOptions, getListsMeta } from 'app/state/lists/selectors';
import { getMessageOptions, getMessagesMeta } from 'app/state/messages/selectors';
import { getCampaignOptions, getCampaignsMeta } from 'app/state/campaigns/selectors';
import {
  getListActivtySegmentFields,
  getSegmentFieldMeta,
  getSegmentOptions,
  getSubscriberSegmentFields,
  getListSegmentsMeta,
} from 'app/state/segments/selectors';
import { fetchLists } from 'app/state/lists/api';
import { fetchCampaigns } from 'app/state/campaigns/api';
import { fetchListSegments } from 'app/state/segments/api';
import { fetchMessages } from 'app/state/messages/api';
import { ArrayRender } from 'app/views/lists/segments/SegmentFormComponents';
import {
  makeSubscriberFieldOptions,
  validationStatusOptions,
  validationSubStatusOptions,
} from 'app/views/lists/segments/segmentUtils';
import { ReduxFormDropdown, ReduxFormInput, required } from 'app/views/messages/ReduxFormInput';
import React from 'react';
import { connect } from 'react-redux';
import {
  arrayPush,
  Field,
  FieldArray,
  FormSection,
  InjectedFormProps,
  reduxForm,
} from 'redux-form';
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Form,
  Grid,
  Header,
  Segment,
  Table,
} from 'semantic-ui-react';
import { concat } from 'lodash';

type OwnProps = {
  listId: number;
  handleCancel(): void;
};

type StateProps = {
  fieldMeta: {};
  subscriberFields: {};
  listActivityFields: {};
  segmentOptions: DropdownItemProps[];
  listOptions: {}[];
  listSegmentsMeta: IPaginatedMeta;
  listsMeta: IPaginatedMeta;
  messageOptions: {}[];
  messagesMeta: IPaginatedMeta;
  campaignOptions: {}[];
  campaignsMeta: IPaginatedMeta;
};

type DispatchProps = {
  arrayPush: typeof arrayPush;
  fetchListSegments: typeof fetchListSegments;
  fetchLists: typeof fetchLists;
  fetchMessages: typeof fetchMessages;
  fetchCampaigns: typeof fetchCampaigns;
};

const formName = 'newSegmentForm';

type EditSegmentFormProps = OwnProps & StateProps & DispatchProps & InjectedFormProps;

class EditSegmentForm extends React.Component<EditSegmentFormProps> {
  renderFieldMeta = (type: 'filter.subscriber' | 'filter.list_activity', name) => {
    const field = this.props.subscriberFields[name];
    if (field) {
      return (
        <FieldArray
          key={`${type}${name}`}
          label={name}
          fieldMeta={this.props.fieldMeta[field.type]}
          field={field}
          name={`${type}.${name}`}
          component={ArrayRender}
        />
      );
    }
    return null;
  };

  createEventFilterFormatter = filterField => {
    return values => {
      if (values) {
        return values.map(v => v[filterField]);
      }
      return '';
    };
  };

  createEventFilterParser = (eventType, filterField) => {
    return values => {
      if (values) {
        return values.map(v => {
          let filterObj = { event_type: eventType };
          filterObj[filterField] = v;
          return filterObj;
        });
      }
      return '';
    };
  };

  formatListValues = values => (values ? values.map(v => v.list_id) : []);

  parseListValues = values => values.map(v => ({ list_id: v, subscription_status: 0 }));

  loadMoreLists = e => {
    e.preventDefault();
    this.props.fetchLists(this.props.listsMeta.next);
  };

  loadMoreListSegments = e => {
    e.preventDefault();
    this.props.fetchListSegments(null, this.props.listSegmentsMeta.next);
  };

  loadMoreMessages = e => {
    e.preventDefault();
    this.props.fetchMessages(this.props.messagesMeta.next);
  };

  loadMoreCampaigns = e => {
    e.preventDefault();
    this.props.fetchCampaigns(this.props.campaignsMeta.next);
  };

  render() {
    const {
      handleSubmit,
      subscriberFields,
      listActivityFields,
      invalid,
      arrayPush,
      segmentOptions,
      listOptions,
      messageOptions,
      campaignOptions,
      handleCancel,
      listsMeta,
      listSegmentsMeta,
      messagesMeta,
      campaignsMeta,
    } = this.props;

    let paginatedListOptions;
    let paginatedSegmentOptions;
    let paginatedMessageOptions;
    let paginatedCampaignOptions;
    const moreLists = listsMeta.next && listsMeta.count > listOptions.length;
    const moreSegments = listSegmentsMeta.next && listSegmentsMeta.count > segmentOptions.length;
    const moreMessages = messagesMeta.next && messagesMeta.count > messageOptions.length;
    const moreCampaigns = campaignsMeta.next && campaignsMeta.count > campaignOptions.length;

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

    if (moreMessages) {
      paginatedMessageOptions = concat(messageOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreMessages} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedMessageOptions = messageOptions;
    }

    if (moreCampaigns) {
      paginatedCampaignOptions = concat(campaignOptions, [
        {
          key: 'load more',
          text: (
            <span>
              <Button fluid content="Load More" onClick={this.loadMoreCampaigns} />
            </span>
          ),
          value: 0,
          disabled: true,
        },
      ]);
    } else {
      paginatedCampaignOptions = campaignOptions;
    }

    return (
      <Form onSubmit={handleSubmit}>
        <Grid padded>
          <Grid.Row as={Form.Group} columns={2}>
            <Grid.Column>
              <Field
                name="name"
                validate={required}
                component={ReduxFormInput}
                label="Segment Name"
                autoFocus
              />
            </Grid.Column>
            <Grid.Column>
              <Field name="limit" type="number" component={ReduxFormInput} label="Limit" />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2} as={Segment}>
            <FormSection name="filter.subscriber.validation_status" component={Grid.Column as any}>
              <Header as="h5">Validation Status</Header>
              <Form.Group widths="equal">
                <Field
                  multiple
                  name="include"
                  options={validationStatusOptions}
                  component={ReduxFormDropdown}
                  label="Include"
                />
                <Field
                  multiple
                  name="exclude"
                  options={validationStatusOptions}
                  component={ReduxFormDropdown}
                  label="Exclude"
                />
              </Form.Group>
            </FormSection>
            <FormSection
              name="filter.subscriber.validation_sub_status"
              component={Grid.Column as any}
            >
              <Header as="h5">Validation Sub Status</Header>
              <Form.Group widths="equal">
                <Field
                  multiple
                  name="include"
                  options={validationSubStatusOptions}
                  component={ReduxFormDropdown}
                  label="Include"
                />
                <Field
                  multiple
                  name="exclude"
                  options={validationSubStatusOptions}
                  component={ReduxFormDropdown}
                  label="Exclude"
                />
              </Form.Group>
            </FormSection>
          </Grid.Row>
          <Grid.Row columns={3} as={Segment}>
            <FormSection name="filter.segment_membership" component={Grid.Column as any}>
              <Header as="h5">Segment Membership</Header>
              <Field
                multiple
                name="include"
                options={paginatedSegmentOptions}
                component={ReduxFormDropdown}
                label="Include"
              />
              <Field
                multiple
                name="exclude"
                options={paginatedSegmentOptions}
                component={ReduxFormDropdown}
                label="Exclude"
              />
            </FormSection>

            <FormSection name="filter.list_membership" component={Grid.Column as any}>
              <Header as="h5">List Membership</Header>
              <Field
                multiple
                name="include"
                options={paginatedListOptions}
                component={ReduxFormDropdown}
                format={this.formatListValues}
                parse={this.parseListValues}
                label="Include"
              />
              <Field
                multiple
                format={this.formatListValues}
                parse={this.parseListValues}
                name="exclude"
                options={paginatedListOptions}
                component={ReduxFormDropdown}
                label="Exclude"
              />
            </FormSection>

            <FormSection name="filter.messages_received" component={Grid.Column as any}>
              <Header as="h5">Messages Received</Header>
              <Field
                multiple
                name="include"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Include"
              />
              <Field
                multiple
                name="exclude"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Exclude"
              />
            </FormSection>
          </Grid.Row>

          <Grid.Row columns={4} as={Segment}>
            <FormSection name="filter.event.messages.clicked" component={Grid.Column as any}>
              <Header as="h5">Messages Clicked</Header>
              <Field
                multiple
                name="include"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Include"
                format={this.createEventFilterFormatter('message_id')}
                parse={this.createEventFilterParser('clicked', 'message_id')}
              />
              <Field
                multiple
                name="exclude"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Exclude"
                format={this.createEventFilterFormatter('message_id')}
                parse={this.createEventFilterParser('clicked', 'message_id')}
              />
            </FormSection>
            <FormSection name="filter.event.messages.opened" component={Grid.Column as any}>
              <Header as="h5">Messages Opened</Header>
              <Field
                multiple
                name="include"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Include"
                format={this.createEventFilterFormatter('message_id')}
                parse={this.createEventFilterParser('opened', 'message_id')}
              />
              <Field
                multiple
                name="exclude"
                options={paginatedMessageOptions}
                component={ReduxFormDropdown}
                label="Exclude"
                format={this.createEventFilterFormatter('message_id')}
                parse={this.createEventFilterParser('opened', 'message_id')}
              />
            </FormSection>
            <FormSection name="filter.event.campaigns.clicked" component={Grid.Column as any}>
              <Header as="h5">Campaigns Clicked</Header>
              <Field
                multiple
                name="include"
                options={paginatedCampaignOptions}
                component={ReduxFormDropdown}
                label="Include"
                format={this.createEventFilterFormatter('campaign_id')}
                parse={this.createEventFilterParser('clicked', 'campaign_id')}
              />
              <Field
                multiple
                name="exclude"
                options={paginatedCampaignOptions}
                component={ReduxFormDropdown}
                label="Exclude"
                format={this.createEventFilterFormatter('campaign_id')}
                parse={this.createEventFilterParser('clicked', 'campaign_id')}
              />
            </FormSection>
            <FormSection name="filter.event.campaigns.opened" component={Grid.Column as any}>
              <Header as="h5">Campaigns Opened</Header>
              <Field
                multiple
                name="include"
                options={paginatedCampaignOptions}
                component={ReduxFormDropdown}
                label="Include"
                format={this.createEventFilterFormatter('campaign_id')}
                parse={this.createEventFilterParser('opened', 'campaign_id')}
              />
              <Field
                multiple
                name="exclude"
                options={paginatedCampaignOptions}
                component={ReduxFormDropdown}
                label="Exclude"
                format={this.createEventFilterFormatter('campaign_id')}
                parse={this.createEventFilterParser('opened', 'campaign_id')}
              />
            </FormSection>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Dropdown
                as={Button}
                type="button"
                text="Add Subscriber Filter"
                onChange={(e, { value }) => {
                  this.setState(prevState => ({
                    previousValue: '',
                    value: '',
                  }));
                  arrayPush(formName, `filter.subscriber.${value}`, {
                    operator: 'exact',
                    value: '',
                    negate: false,
                  });
                }}
                value=""
                options={makeSubscriberFieldOptions(subscriberFields)}
              />
              <Dropdown
                as={Button}
                type="button"
                text="Add List Filter"
                onChange={(e, { value }) => {
                  arrayPush(formName, `filter.list_activity.${value}`, {
                    operator: 'exact',
                    value: '',
                    negate: false,
                  });
                }}
                options={makeSubscriberFieldOptions(listActivityFields)}
              />
              <Table celled compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Description</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Operator</Table.HeaderCell>
                    <Table.HeaderCell width={6}>Values</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Negate</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Remove</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {subscriberFields &&
                    Object.keys(subscriberFields).map(name =>
                      this.renderFieldMeta('filter.subscriber', name),
                    )}
                  {listActivityFields &&
                    Object.keys(listActivityFields).map(name =>
                      this.renderFieldMeta('filter.list_activity', name),
                    )}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button content="Save" disabled={invalid} type="submit" color="green" />
              &nbsp;
              <Button content="Cancel" onClick={handleCancel} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

const ConnectedEditSegment = connect<StateProps>(
  (state: IRedux, ownProps: OwnProps) => ({
    listOptions: getListOptions(state),
    segmentOptions: getSegmentOptions(state, ownProps.listId),
    messageOptions: getMessageOptions(state),
    campaignOptions: getCampaignOptions(state),
    subscriberFields: getSubscriberSegmentFields(state),
    listActivityFields: getListActivtySegmentFields(state),
    fieldMeta: getSegmentFieldMeta(state),
    listSegmentsMeta: getListSegmentsMeta(state),
    listsMeta: getListsMeta(state),
    messagesMeta: getMessagesMeta(state),
    campaignsMeta: getCampaignsMeta(state),
  }),
  {
    arrayPush,
    fetchListSegments,
    fetchLists,
    fetchMessages,
    fetchCampaigns,
  },
)(EditSegmentForm);

export default reduxForm<{}, $FixMe>({ form: formName })(ConnectedEditSegment);
