import { IRedux } from 'app/definitions/redux';
import { addIntegration } from 'app/state/organizations/actions';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';

function AddIntegration({ addIntegration, organization }) {
  const integrationOptions = [
    {
      key: 1,
      text: 'Sendgrid',
      value: 'sendgrid',
      onClick: () => {
        addIntegration({
          integration: 'sendgrid',
          orgId: organization.id,
        });
      },
    },
    {
      key: 2,
      text: 'Mailgun',
      value: 'mailgun',
      onClick: () => {
        addIntegration({
          integration: 'mailgun',
          orgId: organization.id,
        });
      },
    },
    {
      key: 3,
      text: 'Seed List',
      value: 'seed_list',
      onClick: () => {
        addIntegration({
          integration: 'seed_list',
          orgId: organization.id,
        });
      },
    },
    {
      key: 4,
      text: 'Anedot',
      value: 'anedot',
      onClick: () => {
        addIntegration({
          integration: 'anedot',
          orgId: organization.id,
        });
      },
    },
    {
      key: 5,
      text: 'Postal',
      value: 'postal',
      onClick: () => {
        addIntegration({
          integration: 'postal',
          orgId: organization.id,
        });
      },
    },
  ];

  return (
    <Dropdown
      data-test="addIntegrationButton"
      as={Button}
      color="green"
      text="Add Integration"
      options={integrationOptions}
    />
  );
}

export default connect(
  (state: IRedux) => ({
    organization: getActiveOrganization(state),
  }),
  { addIntegration },
)(AddIntegration);
