import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

export default function AddSuppressedEmail({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Suppressed Email" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="createSuppressedEmail"
          autoFocus
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
          placeholder="Suppressed Email"
        />
        <Button
          fluid
          data-test="createSuppressionListSubmit"
          disabled={!email}
          type="submit"
          onClick={() => {
            onSubmit(email);
            setIsOpen(false);
            setEmail('');
          }}
        >
          Create
        </Button>
      </Form>
    </Popup>
  );
}
