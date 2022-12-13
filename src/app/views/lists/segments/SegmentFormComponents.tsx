import { makeOption } from 'app/views/lists/segments/segmentUtils';
import { ReduxFormInput, required } from 'app/views/messages/ReduxFormInput';
import React, { FunctionComponent, useState } from 'react';
import { Field } from 'redux-form';
import { Button, Checkbox, Dropdown, Form, Table } from 'semantic-ui-react';

const offsetValueValidator = value =>
  value && !/^\d+[dhDH]$/i.test(value) ? 'Invalid offset value' : undefined;

const arrayMatch = value => {
  return value && value[0] === '{' && value[value.length - 1] === '}' ? false : true;
};

interface ValueDefault {
  operator: string;
  negate: boolean;
}

interface DateOffset extends ValueDefault {
  offset: string | string[];
}

interface DateValue extends ValueDefault {
  value: string | string[];
}

interface DateInputProps {
  value: DateOffset | DateValue;
  name: string;
  onChange({}): void;
}

const offsetValidators = [offsetValueValidator, required];

const DateInput: FunctionComponent<DateInputProps> = ({ value, onChange, name }) => {
  const [offset, setOffset] = useState('offset' in value);
  const buttonIcon = offset ? 'calendar' : 'calendar outline';
  const valueType = offset ? 'text' : 'date';
  const keyName = offset ? 'offset' : 'value';
  const validator = offset ? offsetValidators : required;

  return (
    <Form.Group>
      {value.operator === 'range' ? (
        <>
          <Field
            validate={validator}
            name={`${name}.${keyName}[0]`}
            placeholder="Beginning"
            component={ReduxFormInput}
            type={valueType}
          />
          <Field
            validate={validator}
            name={`${name}.${keyName}[1]`}
            placeholder="End"
            component={ReduxFormInput}
            type={valueType}
          />
        </>
      ) : (
        <Field
          name={`${name}.${keyName}`}
          validate={validator}
          placeholder="End"
          component={ReduxFormInput}
          type={valueType}
        />
      )}
      <Form.Field>
        <Button
          type="button"
          icon={buttonIcon}
          onClick={() => {
            // clear offset and value from object
            onChange({
              operator: value.operator,
              negate: value.negate,
            });
            setOffset(!offset);
          }}
        />
      </Form.Field>
    </Form.Group>
  );
};

function FilterCell({ fieldMeta, input, member, type }) {
  const { value, onChange } = input;

  return (
    <>
      <Table.Cell>
        <Dropdown
          onChange={(e, data) => onChange({ ...value, operator: data.value })}
          selection
          options={fieldMeta.operators.map(makeOption)}
          value={value.operator}
        />
      </Table.Cell>
      <Table.Cell>
        {type === 'custom_data' && (
          <Field
            validate={required}
            placeholder="Field"
            name={`${member}.field`}
            component={ReduxFormInput}
          />
        )}

        {type === 'date' ? (
          <DateInput name={member} value={value} onChange={onChange} />
        ) : (
          <Field
            validate={type === 'array' ? arrayMatch : required}
            component={ReduxFormInput}
            name={`${member}.value`}
            placeholder="Value"
          />
        )}
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          toggle
          checked={value.negate}
          onChange={(e, { checked }) => {
            onChange({ ...value, negate: checked });
          }}
        />
      </Table.Cell>
    </>
  );
}

export function ArrayRender(props) {
  const { field, fieldMeta } = props;
  return props.fields.map((member, index, fields) => {
    return (
      <Table.Row key={index}>
        <Table.Cell>{props.label}</Table.Cell>
        <Table.Cell>{field.notes}</Table.Cell>
        <Field
          fieldMeta={fieldMeta}
          name={member}
          member={member}
          type={field.type}
          component={FilterCell}
        />
        <Table.Cell>
          <Button icon="remove" onClick={() => fields.remove(index)} />
        </Table.Cell>
      </Table.Row>
    );
  });
}
