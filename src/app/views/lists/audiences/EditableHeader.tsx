import React, { useState } from 'react';
import { Button, Form, Header, Menu } from 'semantic-ui-react';

export default function EditableHeader({ audience, onSubmit, importFn }) {
  const [name, setName] = useState(audience.name);
  const [description, setDescription] = useState(audience.description);
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
          <Form.Group>
            <Form.Button
              disabled={!name}
              content="Save"
              onClick={() => {
                setEditing(false);
                onSubmit({
                  name: name,
                  description,
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
                {audience.name}
                <Header.Subheader>{audience.description}</Header.Subheader>
              </Header>
            </Menu.Item>
            <Menu.Item position="right">
              <Button
                color="green"
                icon="pencil"
                content="Edit Audience"
                onClick={() => setEditing(true)}
              />
              &nbsp;
              <Button color="green" onClick={importFn} content="Bulk Import" icon="file" />
            </Menu.Item>
          </Menu>
        </>
      )}
    </>
  );
}
