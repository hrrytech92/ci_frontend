import { IRedux } from 'app/definitions/redux';

export function getOrgUrl(state: IRedux) {
  return `/org/${getActiveOrganization(state).id}/`;
}

export function getOrganizations(state: IRedux) {
  return state.organizations;
}

export function getActiveOrganization(state: IRedux) {
  return state.organizations[state.activeOrg];
}

function makeOption(integration, id) {
  return {
    key: id,
    text: integration.esp_name,
    value: integration,
  };
}

export function getESPOptions(state: IRedux) {
  const currentOrg = getActiveOrganization(state);

  if (!currentOrg.integrations) {
    return [];
  }

  return [
    ...currentOrg.integrations.sendgrid.map(makeOption),
    ...currentOrg.integrations.mailgun.map(makeOption),
    ...currentOrg.integrations.postal.map(makeOption),
  ];
}

export function getIPPoolOptions(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  const pools = [];

  if (!currentOrg.integrations) {
    return [];
  }

  currentOrg.integrations.sendgrid.map(sendgrid => {
    sendgrid.ip_pools.map((ipPool, index) => {
      pools.push({ key: index, text: ipPool, value: ipPool });
    });
  });

  return pools;
}
