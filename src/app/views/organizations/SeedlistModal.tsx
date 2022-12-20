import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';

function SeedlistModal({ members = [], handleSave }) {
  const [value, setValue] = useState(members.join(', '));
  return (
    <Modal className="bootstrapModalFix" trigger={<a href="#">Show Members</a>}>
      <Modal.Header>Seedlist Members</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <textarea
            style={{ width: '100%', height: '500px' }}
            onChange={e => setValue(e.target.value)}
            value={value}
          />
        </Modal.Description>
        <Button floated="right" content="Save" onClick={() => handleSave(value.split(','))} />
      </Modal.Content>
    </Modal>
  );
}

export default SeedlistModal;
