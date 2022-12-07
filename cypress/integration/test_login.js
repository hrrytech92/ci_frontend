import { el, selectBroadwingOrg } from '../support/commands';
import { EMAIL, PASSWORD } from '../support/index';

describe('Login', () => {
  it('Login fails with wrong password', () => {
    cy.visit('/');

    el('username input').type('fail@test.com');
    el('password input').type('asdfasdf');
    el('loginSubmit').click();
  });

  it('Logs in correctly', () => {
    cy.visit('/');

    el('username input').type(EMAIL);
    el('password input').type(PASSWORD);
    el('loginSubmit').click();
    cy.contains('Organizations').click();

    // Logout
    el('headerMoreDropdown').should('contain', 'More');
    selectBroadwingOrg();
    el('headerMoreDropdown').click();
    cy.contains('Logout').click();
    el('username');
  });
});
