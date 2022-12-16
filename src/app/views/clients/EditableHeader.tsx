import React, { useState } from 'react';
import { Button, Form, Header, Label, Menu } from 'semantic-ui-react';

export default function EditableHeader({ client, onSubmit, toggleDisable }) {
  const [name, setName] = useState(client.name);
  const [sname, setsName] = useState(client.short_name);
  const [description, setDescription] = useState(client.description);
  const [checked, setChecked] = useState(client.is_active);
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
            placeholder="Short Name"
            name="sname"
            value={sname}
            onChange={e => setsName(e.target.value)}
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
            label="active"
            name="is_active"
            onChange={(e, { checked }) => setChecked(checked)}
          />
          <Form.Group>
            <Form.Button
              disabled={!name || !sname || !description}
              content="Save"
              onClick={() => {
                setEditing(false);
                onSubmit({
                  name,
                  short_name: sname,
                  description,
                  is_active: checked,
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
              <Header as="h3" data-test="clientHeader">
                {client.name}
                {client.is_active && <Label color="blue">enabled</Label>}
                <Header.Subheader>{client.short_name}</Header.Subheader>
                <Header.Subheader>{client.description}</Header.Subheader>
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
              <Button onClick={toggleDisable} color="red" icon="check" content="Delete Client" />
            </Menu.Item>
          </Menu>
        </>
      )}
    </>
  );
}
