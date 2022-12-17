import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddAudience({ onSubmit, listId }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Audience" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createAudienceName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Audience Name"
        />
        <Form.Input
          data-test="createAudienceDescription"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="Audience Description"
        />
        <Button
          fluid
          data-test="createAudienceSubmit"
          disabled={!name || !description}
          type="submit"
          onClick={() => {
            onSubmit(listId, {
              description,
              name,
            });
            setIsOpen(false);
            setName('');
            setDescription('');
          }}
        >
          Create
        </Button>
      </Form>
    </Popup>
  );
}
