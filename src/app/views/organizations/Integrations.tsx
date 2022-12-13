import {
  IIntegrations,
  IMailgunAccount,
  IPostalAccount,
  ISendgridAccount,
  IAnedotAccount,
} from 'app/definitions/integrations';
import { IOrganization } from 'app/definitions/organization';
import {
  saveMailgunAccount,
  savePostalAccount,
  saveSeedList,
  saveSendgridAccount,
  saveAnedotAccount,
} from 'app/state/organizations/api';
import { ReduxFormInput } from 'app/views/messages/ReduxFormInput';
import {
  MailgunCard,
  PostalCard,
  SeedlistCard,
  SendgridCard,
  AnedotCard,
} from 'app/views/organizations/IntegrationCard';
import SeedlistModal from 'app/views/organizations/SeedlistModal';
import { pick } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Card, Icon, List } from 'semantic-ui-react';

type IntegrationsProps = {
  organization: IOrganization;
  integrations: IIntegrations;
};

function EditableComponent({ editing, name, children, desc, obfuscate }) {
  return (
    <List.Item data-test={`${name}Item`}>
      <List.Header>{desc}</List.Header>
      {obfuscate ? (
        editing ? (
          <Field name={name} component={ReduxFormInput} type="password" />
        ) : (
          children
        )
      ) : editing ? (
        <Field name={name} component={ReduxFormInput} />
      ) : (
        children
      )}
    </List.Item>
  );
}

function BitfrostWebhookURL({ organization }) {
  const [copied, setCopied] = useState(false);

  if (!organization.bitfrost || organization.bitfrost_tokens.tokens.length < 1) return null;

  const url = `https://bitfrost.campaigninbox.com/email/sendgrid/${
    organization.bitfrost_tokens.tokens[0]
  }`;

  return (
    <List.Item
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(url);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }}
    >
      <List.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Bitfrost Webhook URL</span>
        {!copied ? (
          <Icon name="copy" />
        ) : (
          <span>
            <Icon name="check" color="green" />
            <span>Copied</span>
          </span>
        )}
      </List.Header>
      <p
        style={{
          wordWrap: 'break-word',
        }}
      >
        {url}
      </p>
    </List.Item>
  );
}

type DispatchProps = {
  editMailgunAccount(values: IMailgunAccount): void;
  editPostalAccount(values: IPostalAccount): void;
  editSendgridAccount(values: ISendgridAccount): void;
  editSeedList(values: ISendgridAccount): void;
  editAnedotAccount(values: IAnedotAccount): void;
};

function Integrations({
  organization,
  integrations,
  editMailgunAccount,
  editPostalAccount,
  editSendgridAccount,
  editSeedList,
  editAnedotAccount,
}: IntegrationsProps & DispatchProps) {
  return (
    <Card.Group itemsPerRow={3}>
      {integrations.mailgun.map(integration => (
        <MailgunCard
          form={`mailgun${integration.id}`}
          name={`Mailgun ${integration.id}`}
          key={`mailgun-${integration.id}`}
          integration={integration}
          onSubmit={values => editMailgunAccount({ ...[integration.id], ...values })}
          initialValues={integration}
          renderFields={e => {
            return (
              <>
                <EditableComponent obfuscate={true} editing={e} name="api_key" desc="API Key">
                  {integration.api_key}
                </EditableComponent>
                <EditableComponent
                  obfuscate={false}
                  editing={e}
                  name="description"
                  desc="Description"
                >
                  {integration.description}
                </EditableComponent>
              </>
            );
          }}
        />
      ))}
      {integrations.postal.map(integration => (
        <PostalCard
          form={`postal${integration.id}`}
          name={`Postal ${integration.id}`}
          key={`postal-${integration.id}`}
          integration={integration}
          onSubmit={values => editPostalAccount({ ...[integration.id], ...values })}
          initialValues={integration}
          renderFields={e => {
            return (
              <>
                <EditableComponent obfuscate={true} editing={e} name="api_key" desc="API Key">
                  {integration.api_key}
                </EditableComponent>
                <EditableComponent
                  obfuscate={false}
                  editing={e}
                  name="description"
                  desc="Description"
                >
                  {integration.description}
                </EditableComponent>
              </>
            );
          }}
        />
      ))}
      {integrations.sendgrid.map(integration => (
        <SendgridCard
          renderFields={e => {
            return (
              <>
                <EditableComponent
                  obfuscate={true}
                  editing={e}
                  name="parent_api_key"
                  desc="Parent API Key"
                >
                  {integration.parent_api_key}
                </EditableComponent>
                <EditableComponent
                  obfuscate={false}
                  editing={e}
                  name="description"
                  desc="Description"
                >
                  {integration.description}
                </EditableComponent>
                <EditableComponent
                  obfuscate={true}
                  editing={e}
                  name="sub_user_api_key"
                  desc="Subuser API Key"
                >
                  {integration.sub_user_api_key}
                </EditableComponent>
                <EditableComponent
                  obfuscate={false}
                  editing={e}
                  name="sub_user_name"
                  desc="Subuser Username"
                >
                  {integration.sub_user_name}
                </EditableComponent>
                {!e && <BitfrostWebhookURL organization={organization} />}
              </>
            );
          }}
          form={`sendgrid${integration.id}`}
          name={`Sendgrid ${integration.id}`}
          key={`sendgrid-${integration.id}`}
          integration={integration}
          onSubmit={values => editSendgridAccount({ ...[integration.id], ...values })}
          initialValues={integration}
        />
      ))}
      {integrations.seed_list
        .filter(s => !s.disabled)
        .map(integration => (
          <SeedlistCard
            name={`Seedlist ${integration.id}`}
            renderFields={e => {
              return (
                <>
                  <EditableComponent obfuscate={false} editing={e} name="name" desc="Name">
                    {integration.name}
                  </EditableComponent>
                  <EditableComponent
                    obfuscate={false}
                    editing={e}
                    name="description"
                    desc="Description"
                  >
                    {integration.description}
                  </EditableComponent>
                  <SeedlistModal
                    // @ts-ignore
                    handleSave={members => editSeedList({ ...integration, members: members })}
                    // @ts-ignore
                    members={integration.members}
                  />
                </>
              );
            }}
            form={`seedlist${integration.id}`}
            key={`sendgrid-${integration.id}`}
            integration={integration}
            onSubmit={values => editSeedList({ ...values })}
            initialValues={pick(integration, ['id', 'name', 'description'])}
          />
        ))}
      {integrations.anedot.map(integration => (
        <AnedotCard
          renderFields={e => {
            return (
              <>
                <EditableComponent obfuscate={true} editing={e} name="token" desc="Token">
                  {integration.token}
                </EditableComponent>
              </>
            );
          }}
          form={`anedot${integration.id}`}
          name={`anedot ${integration.id}`}
          key={`anedot-${integration.id}`}
          integration={integration}
          onSubmit={values => editAnedotAccount({ ...[integration.id], ...values })}
          initialValues={integration}
        />
      ))}
    </Card.Group>
  );
}

export default connect<{}, {}, $FixMe>(
  null,
  {
    editMailgunAccount: saveMailgunAccount,
    editPostalAccount: savePostalAccount,
    editSendgridAccount: saveSendgridAccount,
    editSeedList: saveSeedList,
    editAnedotAccount: saveAnedotAccount,
  },
)(Integrations);
