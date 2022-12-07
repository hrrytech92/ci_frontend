import React from 'react';
import { Header } from 'semantic-ui-react';

export const makeSubscriberFieldOptions = subscriberFields => {
  if (subscriberFields) {
    return Object.keys(subscriberFields).map((name, index) => {
      return {
        key: index,
        value: name,
        text: name,
        content: (
          <Header
            as="h5"
            content={
              <>
                {name}
                <Header.Subheader>{subscriberFields[name].notes}</Header.Subheader>
              </>
            }
          />
        ),
      };
    });
  }
};

const validationStatuses = [
  'none',
  'valid',
  'invalid',
  'catch-all',
  'unknown',
  'spamtrap',
  'abuse',
  'do_not_mail',
];

export const makeOption = (text, i) => ({
  key: i,
  value: text,
  text,
});

export const validationStatusOptions = validationStatuses.map(makeOption);

const validationSubStatuses = [
  'none',
  'antispam_system',
  'greylisted',
  'mail_server_temporary_error',
  'forcible_disconnect',
  'mail_server_did_not_respond',
  'timeout_exceeded',
  'failed_smtp_connection',
  'mailbox_quota_exceeded',
  'exception_occurred',
  'possible_traps',
  'role_based',
  'global_suppression',
  'mailbox_not_found',
  'no_dns_entries',
  'failed_syntax_check',
  'possible_typo',
  'unroutable_ip_address',
  'leading_period_removed',
  'does_not_accept_mail',
  'alias_address',
  'role_based_catch_all',
  'disposable',
  'toxic',
];

export const validationSubStatusOptions = validationSubStatuses.map(makeOption);
