import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function EditTag({ tag, onSubmit }) {
  const [name, setName] = useState(tag.name);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="pencil" content="Edit Tag" color="green" />}
    >
      {!tag || (
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
                id: tag.id,
                name: name,
              });
              setIsOpen(false);
              // setName('');
            }}
          >
            Save
          </Button>
        </Form>
      )}
    </Popup>
  );
}
