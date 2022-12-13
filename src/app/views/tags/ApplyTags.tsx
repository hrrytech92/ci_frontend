import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';
import store from 'app/store';

export default function ApplyTags(props: {
  onSubmit: Function;
  onEnter?: Function;
  exclude: number[];
}) {
  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const tags = store.getState().tags.byId.tags;

  const filteredTags = () => {
    if (!tags) return [];

    return tags.filter(tag => {
      return props.exclude.indexOf(tag.id) < 0 && tag.name.includes(term);
    });
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      props.onEnter({
        name: term,
      });
      setTerm('');
    }
  };

  return (
    <Popup
      open={isOpen}
      on="click"
      position="bottom left"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={<Button icon="plus" content="Add Tag" color="green" />}
    >
      <Form>
        <Form.Input
          data-test="findTagName"
          autoFocus
          value={term}
          onKeyPress={e => handleKeyPress(e)}
          onChange={e => {
            setTerm(e.target.value.replace(' ', '_').toLowerCase());
          }}
          placeholder="Tag Name"
        />
        <div>
          {tags && tags.length && filteredTags().length > 0 ? (
            filteredTags().map(tag => {
              return (
                <Button
                  key={tag.id}
                  style={{ width: '100%', marginBottom: '4px' }}
                  onClick={e => {
                    props.onSubmit(tag);
                  }}
                >
                  {tag.name}
                </Button>
              );
            })
          ) : (
            <p style={{ textAlign: 'center' }}>Press enter to create</p>
          )}
        </div>
      </Form>
    </Popup>
  );
}
