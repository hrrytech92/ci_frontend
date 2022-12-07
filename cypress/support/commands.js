import { API_URL, EMAIL, PASSWORD } from '../support/index';

export const el = e => {
  const args = e.split(' ');

  if (args.length > 1) {
    return cy.get(`[data-test="${args[0]}"] ${args[1]}`);
  }

  return cy.get(`[data-test="${e}"]`);
};

export function selectBroadwingOrg() {
  cy.login();
  cy.visit('/');

  el('headerMoreDropdown').click();
  cy.contains('Broadwing Coffee').click();
}

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: `${API_URL}auth/login/`,
    body: {
      username: EMAIL,
      password: PASSWORD,
    },
  }).then(resp => {
    window.localStorage.setItem('_ci_token', resp.body.token);
  });
});
