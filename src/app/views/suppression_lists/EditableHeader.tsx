import React, { useState } from 'react';
import { Button, Form, Header, Menu } from 'semantic-ui-react';

export default function EditableHeader({ suppressionList, onSubmit }) {
  const [name, setName] = useState(suppressionList.name);
  const [description, setDescription] = useState(suppressionList.description);
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
                  name,
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
                {suppressionList.name}
                <Header.Subheader>{suppressionList.description}</Header.Subheader>
              </Header>
            </Menu.Item>
            <Menu.Item position="right">
              <Button
                color="green"
                icon="pencil"
                content="Edit Details"
                onClick={() => setEditing(true)}
              />
            </Menu.Item>
          </Menu>
        </>
      )}
    </>
  );
}
