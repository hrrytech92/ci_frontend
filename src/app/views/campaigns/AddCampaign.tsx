import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddCampaign({ onSubmit }) {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Campaign" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="addCampaignName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Campaign Name"
        />
        <Button
          fluid
          data-test="addCampaignSubmit"
          disabled={!name}
          type="submit"
          onClick={() => {
            setIsOpen(false);
            setName('');
            onSubmit({ name });
          }}
        >
          Create
        </Button>
      </Form>
    </Popup>
  );
}
