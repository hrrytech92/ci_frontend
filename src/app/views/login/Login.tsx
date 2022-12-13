import { loginUser } from 'app/actions/userActions';
import { validateEmail } from 'app/views/formUtils';
import { ReduxFormInput, required } from 'app/views/messages/ReduxFormInput';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Form, Image, Segment } from 'semantic-ui-react';
import './login.scss';

type LoginContainerProps = {
  loginUser: typeof loginUser;
} & InjectedFormProps &
  RouteComponentProps<{}>;

const LoginContainer: FunctionComponent<LoginContainerProps> = ({
  handleSubmit,
  invalid,
  submitting,
  loginUser,
}) => {
  return (
    <div className="login-view">
      <Segment padded="very" style={{ width: '350px', margin: 'auto', top: '25%' }}>
        <Image centered src="/app/images/ci.png" alt="Campaign Inbox" />
        <br />
        <br />
        <Form onSubmit={handleSubmit(loginUser)}>
          <Form.Field>
            <Field
              validate={[required, validateEmail]}
              component={ReduxFormInput}
              name="username"
              type="text"
              data-test="username"
              placeholder="Email"
            />
          </Form.Field>
          <Form.Field>
            <Field
              validate={required}
              component={ReduxFormInput}
              name="password"
              type="password"
              data-test="password"
              placeholder="Password"
            />
          </Form.Field>
          <Form.Button
            disabled={invalid || submitting}
            type="submit"
            data-test="loginSubmit"
            content="Login"
            color="green"
            fluid
          />
        </Form>
      </Segment>
    </div>
  );
};

const ConnectedLoginContainer = connect(
  null,
  {
    loginUser,
  },
)(LoginContainer);

export default reduxForm({
  form: 'loginForm',
  onSubmitSuccess: (result, dispatch, props: LoginContainerProps) => {
    props.history.push('/');
  },
})(ConnectedLoginContainer);
