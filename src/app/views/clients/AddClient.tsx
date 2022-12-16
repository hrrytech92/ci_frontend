import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddClient({ onSubmit }) {
  const [name, setName] = useState('');
  const [sname, setsName] = useState('');
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
      trigger={<Button icon="plus" content="Add Client" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createClientName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          placeholder="Client Name"
        />
        <Form.Input
          data-test="createClientShortName"
          value={sname}
          onChange={e => {
            setsName(e.target.value);
          }}
          placeholder="Client Short Name"
        />
        <Form.Input
          data-test="createClientDescription"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="Client Description"
        />
        <Form.Checkbox
          label="active"
          checked={checked}
          onChange={(e, { checked }) => {
            setChecked(checked);
          }}
          placeholder="Client Active Status"
        />
        <Button
          fluid
          data-test="createClientSubmit"
          disabled={!name || !sname || !description}
          type="submit"
          onClick={() => {
            onSubmit({
              description,
              name,
              short_name: sname,
              is_active: checked,
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
