import { IOrganization } from 'app/definitions/organization';
import { ITemplate } from 'app/definitions/template';
import { ReduxFormVariables, required } from 'app/views/messages/ReduxFormInput';
import { ReduxFormTinyMCE } from 'app/views/templates/ReduxFormTinyMCE';
import { toPairs } from 'lodash';
import React from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, Form, Label, Menu, Segment } from 'semantic-ui-react';

interface EditTemplateProps {
  organization: IOrganization;
  onCancel(): void;
}

const defaultVariables = [
  'organization_id',
  'message_id',
  'list_id',
  'campaign_id',
  'segment_id',
  'template_id',
  'subscriber_id',
];

class EditTemplate extends React.Component<EditTemplateProps & InjectedFormProps<ITemplate>> {
  render() {
    const { handleSubmit, organization, valid } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Form.Field>
              <label>Template Name</label>
              <Field validate={[required]} component="input" type="text" name="name" />
            </Form.Field>
          </Menu.Item>
          <Menu.Item position="right">
            <Button onClick={this.props.onCancel} content="Cancel" />
            &nbsp;
            <Button color="green" disabled={!valid} type="submit" content="Save" />
          </Menu.Item>
        </Menu>
        <Segment>
          <Field title="Template Variables" name="variables" component={ReduxFormVariables} />
          <Form.Field>
            <label>Default Variables</label>
            {defaultVariables.map((v, i) => (
              <Label basic key={i}>
                {v}
              </Label>
            ))}
          </Form.Field>
          <Form.Field>
            <label>Organization Variables</label>
            {toPairs(organization.variables).map((variablePair, i) => (
              <Label basic key={i}>
                {variablePair[0]}
                <Label.Detail>{variablePair[1]}</Label.Detail>
              </Label>
            ))}
          </Form.Field>
        </Segment>
        <Field validate={[required]} component={ReduxFormTinyMCE} name="html_template" />
      </Form>
    );
  }
}

export default reduxForm<{}, $FixMe>({ form: 'editTemplate' })(EditTemplate);
