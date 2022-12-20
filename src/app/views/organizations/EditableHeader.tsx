import AddIntegration from 'app/views/organizations/AddIntegration';
import React, { useState } from 'react';
import { Button, Form, Header, Menu } from 'semantic-ui-react';

export default function EditableHeader({ value, onSubmit, deleteOrg }) {
  const [name, setName] = useState(value);
  const [editing, setEditing] = useState(false);

  return (
    <>
      {editing ? (
        <Menu secondary>
          <Menu.Item style={{ paddingLeft: 0 }}>
            <Form.Input
              width={10}
              placeholder="Name"
              name="name"
              value={name}
              data-test="orgNameInput"
              autoFocus
              onChange={e => setName(e.target.value)}
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Button
              color="green"
              disabled={!name}
              content="Save"
              data-test="orgNameSubmit"
              onClick={() => {
                onSubmit(name);
                setEditing(false);
              }}
            />
            &nbsp;
            <Button basic content="Cancel" onClick={() => setEditing(false)} />
          </Menu.Item>
        </Menu>
      ) : (
        <Menu secondary>
          <Menu.Item className="noLeftPadding">
            <Header as="h3" data-test="orgHeader">
              {value}
            </Header>
          </Menu.Item>
          <Menu.Item position="right">
            <Button
              data-test="orgDeleteButton"
              color="red"
              icon="trash"
              content="Delete Organization"
              onClick={deleteOrg}
            />
            &nbsp;
            <Button
              data-test="orgEditButton"
              color="green"
              icon="pencil"
              content="Edit Name"
              onClick={() => setEditing(true)}
            />
            &nbsp;
            <AddIntegration />
          </Menu.Item>
        </Menu>
      )}
    </>
  );
}
