import { omit, toPairs } from 'lodash';
import React, { useState } from 'react';
import { WrappedFieldProps } from 'redux-form';
import { Dropdown, Form, Icon, Input, Label } from 'semantic-ui-react';

export const required = value => (value ? undefined : 'Required');

export const ReduxFormInput = ({ meta, ...rest }: WrappedFieldProps) => {
  return <Form.Input error={meta.touched && meta.invalid} {...rest} value={rest.input.value} />;
};

export const ReduxFormDropdownInput = ({ dropdownLabel, label, meta, ...rest }) => (
  <Form.Field>
    <label>{label}</label>
    <Input
      error={meta.touched && meta.invalid}
      label={dropdownLabel}
      {...rest}
      value={rest.input.value}
    />
  </Form.Field>
);

export const ReduxFormVariables = ({ ...props }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const title = props.title || 'Message Variables';

  return (
    <Form.Field data-test="variableFormField">
      <label>{title}</label>
      <>
        {toPairs(props.input.value).map((variablePair, i) => (
          <Label basic key={i}>
            {variablePair[0]}
            <Label.Detail>{variablePair[1]}</Label.Detail>
            <Icon
              name="delete"
              onClick={() => {
                props.input.onChange(omit(props.input.value, variablePair[0]));
              }}
            />
          </Label>
        ))}
      </>
      <Form.Group>
        <Form.Input
          data-test="variableName"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <Form.Input
          data-test="variableValue"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value"
        />
        <Form.Button
          data-test="variableAdd"
          disabled={!name || !value}
          onClick={e => {
            e.preventDefault();
            setName('');
            setValue('');
            props.input.onChange({ ...props.input.value, [name]: value });
          }}
        >
          Add Variable
        </Form.Button>
      </Form.Group>
    </Form.Field>
  );
};

export const ReduxFormDropdown = (props: WrappedFieldProps & { label: string }) => {
  return (
    <Form.Field>
      <label>{props.label}</label>
      <Dropdown
        selection
        selectOnNavigation={false}
        selectOnBlur={false}
        {...props}
        value={props.input.value}
        onChange={(event, { value }) => props.input.onChange(value)}
      />
    </Form.Field>
  );
};
