import React, { useState } from 'react';
import { Button, Form, Popup, Dropdown } from 'semantic-ui-react';

export default function MoveMessage({ onSubmit, campaignOptions, disabled }) {
  const [campaign, setCampaign] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={
        <Button
          disabled={disabled}
          size="tiny"
          color="blue"
          icon="level up"
          compact
          content="Move"
        />
      }
    >
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select Campaign"
            autoFocus
            options={campaignOptions}
            selection
            onChange={(e, { value }) => {
              setCampaign(value);
            }}
          />
        </Form.Field>
        <Button
          fluid
          disabled={!campaign}
          type="submit"
          onClick={() => {
            onSubmit({
              campaign,
            });
            setIsOpen(false);
            setCampaign(null);
          }}
        >
          Move
        </Button>
      </Form>
    </Popup>
  );
}
