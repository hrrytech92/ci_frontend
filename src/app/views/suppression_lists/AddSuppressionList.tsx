import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddSuppressionList({ onSubmit }) {
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
      trigger={<Button icon="plus" content="Add Suppression List" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createSuppressionListName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Suppression List Name"
        />
        <Form.Input
          data-test="createSuppressionListDescription"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="Suppression List Description"
        />
        <Button
          fluid
          data-test="createSuppressionListSubmit"
          disabled={!name || !description}
          type="submit"
          onClick={() => {
            onSubmit({
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
