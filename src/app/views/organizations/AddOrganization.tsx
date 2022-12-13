import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

interface IProps {
  onSubmit: ({ account_name, bitfrost }) => void;
}

function AddOrganization({ onSubmit }: IProps) {
  const [name, setName] = useState('');
  const [bitfrost, setBitfrost] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={
        <Button data-test="addOrgButton" icon="plus" content="Add Organization" color="green" />
      }
    >
      <Form>
        <Form.Input
          autoFocus
          data-test="orgNameInput"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Organization Name"
        />
        <Form.Checkbox
          autoFocus
          data-test="orgBitfrostInput"
          checked={bitfrost}
          onChange={e => {
            setBitfrost(e.currentTarget.checked);
          }}
          label="Create in Bitfrost?"
        />
        <Button
          fluid
          data-test="orgNameSubmit"
          color="green"
          disabled={!name}
          type="submit"
          onClick={() => {
            onSubmit({
              account_name: name,
              bitfrost,
            });

            setIsOpen(false);
            setName('');
          }}
        >
          Create Organization
        </Button>
      </Form>
    </Popup>
  );
}

export default AddOrganization;
