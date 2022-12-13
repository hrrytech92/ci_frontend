import {
  IMailgunAccount,
  IPostalAccount,
  ISeedList,
  ISendgridAccount,
  IAnedotAccount,
} from 'app/definitions/integrations';
import { deleteSeedList } from 'app/state/organizations/api';
import { IRedux } from 'app/definitions/redux';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Card, Form, List } from 'semantic-ui-react';
import { has } from 'lodash';

interface IProps {
  integration: IMailgunAccount | IPostalAccount | ISendgridAccount | ISeedList | IAnedotAccount;
  name: string;
  fields?: {};
  deleteIntegation?: any;
  renderFields: (e: any) => any;
}

type IntegrationCardProps = IProps & any;

function IntegrationCard({
  integration,
  name,
  handleSubmit,
  renderFields,
  deleteIntegation,
}: IntegrationCardProps) {
  const [editing, setEditing] = useState(integration.new || false);
  const hasSoftDelete = has(integration, 'disabled');
  return (
    <Card
      as={Form}
      onSubmit={(e, data) => {
        handleSubmit(e, data);
        setEditing(false);
      }}
    >
      <Card.Content>
        <Card.Header>{integration.id ? name : `Add New`}</Card.Header>
        <Card.Description>
          <List>{renderFields(editing)}</List>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {editing ? (
          <>
            <Button type="submit" floated="right" color="green" content="Save" />
            <Button floated="right" onClick={() => setEditing(false)} content="Cancel" />
          </>
        ) : (
          <>
            <Button
              data-test="editIntegrationButton"
              floated="right"
              onClick={e => {
                e.preventDefault();
                setEditing(true);
              }}
              content="Edit"
              icon="pencil"
            />

            {hasSoftDelete ? (
              <Button
                data-test="disabledIntegrationButton"
                floated="right"
                onClick={e => {
                  e.preventDefault();
                  console.log('deleting integration');
                  deleteIntegation(integration.id);
                }}
                content="Delete"
                color="red"
                icon="trash"
              />
            ) : (
              <></>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );
}

// @ts-ignore
export const MailgunCard = reduxForm<any, IntegrationCardProps>()(IntegrationCard);
// @ts-ignore
export const PostalCard = reduxForm<any, IntegrationCardProps>()(IntegrationCard);
// @ts-ignore
export const SendgridCard = reduxForm<any, IntegrationCardProps>()(IntegrationCard);
// @ts-ignore
export const SeedlistCardForm = reduxForm<any, IntegrationCardProps>()(IntegrationCard);
// @ts-ignore
export const AnedotCard = reduxForm<any, IntegrationCardProps>()(IntegrationCard);

export const SeedlistCard = connect<any, any, $FixMe>(
  (state: IRedux) => {
    return {};
  },
  {
    deleteIntegation: deleteSeedList,
  },
)(SeedlistCardForm);
