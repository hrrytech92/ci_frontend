import { showError, showSuccess } from 'app/state/notifications/actions';
import { ReduxFormInput } from 'app/views/messages/ReduxFormInput';
import React from 'react';
import { connect } from 'react-redux';
import { Field, getFormSyncErrors, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';

interface StateProps {
  errors: string[];
  showError: typeof showError;
  showSuccess: typeof showSuccess;
}

const matchingPassword = (value, values) => {
  const { password, password_confirm } = values;
  if (password !== password_confirm) {
    return 'Password does not match.';
  }
  if (!password || (password_confirm && password_confirm.length < 3)) {
    return 'Password too short.';
  }
};

const Profile: React.FunctionComponent<StateProps & InjectedFormProps> = ({
  handleSubmit,
  invalid,
  errors,
  anyTouched,
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Field component={ReduxFormInput} type="password" placeholder="Password" name="password" />
      <Field
        validate={matchingPassword}
        component={ReduxFormInput}
        type="password"
        placeholder="Confirm Password"
        name="password_confirm"
        onChange={() => {}}
      />
      <Button disabled={invalid} color="green" type="submit" content="Update Password" />
      {anyTouched && errors && <span>{errors['password_confirm']}</span>}
    </Form>
  );
};

const ConnectedProfile = connect(
  state => ({
    errors: getFormSyncErrors('ProfileForm')(state),
  }),
  {
    showError,
    showSuccess,
  },
)(Profile);

export default reduxForm({ form: 'ProfileForm' })(ConnectedProfile);
