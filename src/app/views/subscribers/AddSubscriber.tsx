import { isValidEmail } from 'app/views/formUtils';
import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';

const AddSubscriber = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <Popup
      open={open}
      on="click"
      position="bottom left"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      trigger={<Button icon="plus" content="Add Subscriber" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="subscriberEmail"
          autoFocus
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
          placeholder="Subscriber Email"
        />
        <Button
          fluid
          data-test="addSubscriberSubmit"
          disabled={!isValidEmail(email)}
          type="submit"
          onClick={() => {
            setEmail('');
            setOpen(false);
            onSubmit({ email });
          }}
        >
          Add Subscriber
        </Button>
      </Form>
    </Popup>
  );
};

export default AddSubscriber;
