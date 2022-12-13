import React, { useState } from 'react';
import { Button, Form, Header, Label, Menu } from 'semantic-ui-react';

export default function EditableHeader({ list, onSubmit, disabled, toggleDisable }) {
  const [name, setName] = useState(list.list_name);
  const [description, setDescription] = useState(list.description);
  const [checked, setChecked] = useState(list.primary);
  const [editing, setEditing] = useState(false);

  return (
    <>
      {editing ? (
        <Form>
          <Form.Input
            width={10}
            placeholder="Name"
            name="name"
            value={name}
            autoFocus
            onChange={e => setName(e.target.value)}
          />
          <Form.Input
            width={10}
            placeholder="Description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Form.Checkbox
            checked={checked}
            label="Primary List"
            name="primary"
            onChange={(e, { checked }) => setChecked(checked)}
          />
          <Form.Group>
            <Form.Button
              disabled={!name}
              content="Save"
              onClick={() => {
                setEditing(false);
                onSubmit({
                  list_name: name,
                  description,
                  primary: checked,
                });
              }}
            />
            <Form.Button basic content="Cancel" onClick={() => setEditing(false)} />
          </Form.Group>
        </Form>
      ) : (
        <>
          <Menu secondary>
            <Menu.Item className="noLeftPadding">
              <Header as="h3" data-test="listHeader">
                {list.list_name}
                {disabled && <Label>Disabled</Label>}
                {list.primary && <Label color="blue">Primary</Label>}
                <Header.Subheader>{list.description}</Header.Subheader>
              </Header>
            </Menu.Item>
            <Menu.Item position="right">
              <Button
                color="green"
                icon="pencil"
                content="Edit Details"
                onClick={() => setEditing(true)}
              />
              &nbsp;
              {disabled ? (
                <Button onClick={toggleDisable} color="green" icon="check" content="Enable List" />
              ) : (
                <Button onClick={toggleDisable} icon="check" content="Disable List" />
              )}
            </Menu.Item>
          </Menu>
        </>
      )}
    </>
  );
}
