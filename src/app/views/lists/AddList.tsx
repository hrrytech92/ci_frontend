import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddList({ onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add List" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createListName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="List Name"
        />
        <Form.Input
          data-test="createListDescription"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="List Description"
        />
        <Form.Checkbox
          label="Primary List"
          value={name}
          checked={checked}
          onChange={(e, { checked }) => {
            setChecked(checked);
          }}
          placeholder="List Description"
        />
        <Button
          fluid
          data-test="createListSubmit"
          disabled={!name || !description}
          type="submit"
          onClick={() => {
            onSubmit({
              description,
              list_name: name,
              primary: checked,
            });
            setIsOpen(false);
            setName('');
            setDescription('');
            setChecked(false);
          }}
        >
          Create
        </Button>
      </Form>
    </Popup>
  );
}
