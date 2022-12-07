import { IRedux } from 'app/definitions/redux';
import { getClientListOptions } from 'app/state/campaigns/selectors';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, DropdownItemProps, Form, Header, Label, Menu } from 'semantic-ui-react';
import { ReduxFormDropdown, ReduxFormInput, required } from '../messages/ReduxFormInput';

interface IProps {
  value: any;
  onSubmit: any;
  disabled: any;
  toggleDisable: any;
  handleAddNew: any;
}

type ConnectProps = {
  clientListOptions: DropdownItemProps[];
};

type CombinedProps = IProps & ConnectProps & InjectedFormProps;

const EditableHeader: React.FunctionComponent<CombinedProps> = ({
  value,
  handleSubmit,
  onSubmit,
  disabled,
  toggleDisable,
  handleAddNew,
  clientListOptions,
}) => {
  // const [name, setName] = useState(value);
  const [editing, setEditing] = useState(false);

  return (
    <>
      {editing ? (
        <Form onSubmit={handleSubmit} data-test="editClientForm">
          <Form.Group>
            <Field
              width={10}
              name="name"
              validate={[required]}
              component={ReduxFormInput}
              label="Campaign Name"
              autoFocus
            />
            <Field
              data-test="clients"
              label="Client"
              name="client"
              component={ReduxFormDropdown}
              options={clientListOptions}
            />
          </Form.Group>
          <Form.Group>
            <Form.Button
              // disabled={!name}
              type="Submit"
              content="Save"
              // onClick={() => {
              //   setEditing(false);
              // }}
            />
            <Form.Button basic content="Back" onClick={() => setEditing(false)} />
          </Form.Group>
        </Form>
      ) : (
        <>
          <Menu secondary>
            <Menu.Item className="noLeftPadding displayBlock">
              <Header as="h3" data-test="campaignHeaderName">
                {value.name} {disabled && <Label>Disabled</Label>}
              </Header>
              <Header as="h5">Client ID: {value.client}</Header>
            </Menu.Item>
            <Menu.Item position="right">
              {disabled ? (
                <Button
                  onClick={toggleDisable}
                  color="green"
                  icon="check"
                  content="Enable Campaign"
                />
              ) : (
                <Button onClick={toggleDisable} icon="ban" content="Disable Campaign" />
              )}
              &nbsp;
              <Button
                color="green"
                icon="pencil"
                content="Edit"
                onClick={() => setEditing(true)}
              />
              &nbsp;
              <Button onClick={handleAddNew} color="green" icon="plus" content="Add Message" />
            </Menu.Item>
          </Menu>
        </>
      )}
    </>
  );
};

const ReduxEditCampaign = reduxForm({ form: 'editClient' })(EditableHeader);

export default connect<any, any, $FixMe>((state: IRedux) => {
  return {
    clientListOptions: getClientListOptions(state),
  };
})(ReduxEditCampaign);
