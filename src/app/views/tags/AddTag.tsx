import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddTag({ onSubmit }) {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Tag" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createTagName"
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value.replace(' ', '_').toLowerCase());
          }}
          placeholder="Tag Name"
        />
        <Button
          fluid
          data-test="createTagSubmit"
          disabled={!name}
          type="submit"
          onClick={() => {
            onSubmit({
              name: name,
            });
            setIsOpen(false);
            setName('');
          }}
        >
          Create
        </Button>
      </Form>
    </Popup>
  );
}
