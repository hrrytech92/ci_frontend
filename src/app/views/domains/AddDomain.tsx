import { IDomain } from 'app/definitions/domain';
import { ISendgridAccount } from 'app/definitions/integrations';
import { IRedux } from 'app/definitions/redux';
import { addDomain } from 'app/state/domains/api';
import { getESPOptions, getIPPoolOptions } from 'app/state/organizations/selectors';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, DropdownItemProps, Form, Popup } from 'semantic-ui-react';

interface IProps {
  addDomain: (domain) => IDomain;
  espOptions: DropdownItemProps[];
  ipPoolOptions: DropdownItemProps[];
}

function AddDomain({ addDomain, espOptions, ipPoolOptions }: IProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [esp, setEsp] = useState({}) as [ISendgridAccount, any];
  const [isOpen, setIsOpen] = useState(false);
  const [ippool, setIppool] = useState('');

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Domain" color="green" />}
    >
      <Form>
        <Form.Input
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Domain Name"
        />
        <Form.Input
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="Description"
        />
        <Form.Field>
          <Dropdown
            placeholder="Select ESP"
            options={espOptions}
            selection
            onChange={(e, { value }) => {
              setEsp(value);
            }}
          />
        </Form.Field>
        {esp.esp_name === 'sendgrid' && (
          <Form.Field>
            <Dropdown
              placeholder="Choose IP pool"
              options={ipPoolOptions}
              selection
              onChange={(e, { value }) => {
                setIppool(String(value));
              }}
            />
          </Form.Field>
        )}
        <Button
          fluid
          color="green"
          disabled={!name || !description || !esp.id}
          type="submit"
          onClick={() => {
            addDomain({
              name,
              description,
              esp: esp.esp_name,
              esp_account_id: esp.id,
              ip_pool: ippool,
            });

            setIsOpen(false);
            setName('');
            setDescription('');
            setEsp({});
            setIppool('');
          }}
        >
          Create Domain
        </Button>
      </Form>
    </Popup>
  );
}

export default connect<{}, {}, $FixMe>(
  (state: IRedux) => ({
    espOptions: getESPOptions(state),
    ipPoolOptions: getIPPoolOptions(state),
  }),
  { addDomain },
)(AddDomain);
