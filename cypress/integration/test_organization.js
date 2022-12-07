import { el } from '../support/commands';

function addMailgunIntegration() {
  el('addIntegrationButton').click();
  cy.get('[role="option"]')
    .contains('Mailgun')
    .click();

  el('api_keyItem')
    .find('input')
    .type('Updated API Key');
  el('descriptionItem')
    .find('input')
    .type('Updated Description');

  cy.get('button')
    .contains('Save')
    .click();

  el('api_keyItem').should('contain', '*** Key');
  el('descriptionItem').should('contain', 'Updated Description');

  el('editIntegrationButton').click();

  el('api_keyItem')
    .find('input')
    .clear()
    .type('Edited Updated API Key');
  el('descriptionItem')
    .find('input')
    .clear()
    .type('Edited Updated Description');

  cy.get('button')
    .contains('Save')
    .click();

  el('api_keyItem').should('contain', '*** Key');
  el('descriptionItem').should('contain', 'Edited Updated Description');
}

function addPostalIntegration() {
  el('addIntegrationButton').click();
  cy.get('[role="option"]')
    .contains('Postal')
    .click();

  el('api_keyItem')
    .find('input')
    .type('Updated API Key');
  el('descriptionItem')
    .find('input')
    .type('Updated Description');

  cy.get('button')
    .contains('Save')
    .click();

  el('api_keyItem').should('contain', '*** Key');
  el('descriptionItem').should('contain', 'Updated Description');

  el('editIntegrationButton').click();

  el('api_keyItem')
    .find('input')
    .clear()
    .type('Edited Updated API Key');
  el('descriptionItem')
    .find('input')
    .clear()
    .type('Edited Updated Description');

  cy.get('button')
    .contains('Save')
    .click();

  el('api_keyItem').should('contain', '*** Key');
  el('descriptionItem').should('contain', 'Edited Updated Description');
}

function addSeedlistIntegration() {
  el('addIntegrationButton').click();
  cy.get('[role="option"]')
    .contains('Seed List')
    .click();

  el('nameItem')
    .find('input')
    .type('Updated Name');
  el('descriptionItem')
    .find('input')
    .type('Updated Description');

  cy.get('button')
    .contains('Save')
    .click();

  el('nameItem').should('contain', 'Updated Name');
  el('descriptionItem').should('contain', 'Updated Description');
}

describe('Organization', () => {
  it('Organization CRUD', () => {
    const orgName = `Test Org ${new Date().getTime()}`;
    const newOrgName = 'Updated Test Org';

    cy.login();
    cy.visit('/');
    cy.contains('Organizations').click();

    // Create New
    el('addOrgButton').click();
    el('orgNameInput')
      .find('input')
      .type(orgName);
    el('orgNameSubmit').click();

    // Edit
    el('campaignsTable')
      .contains(orgName)
      .click();

    el('headerMoreDropdown').should('contain', orgName);

    cy.contains('Edit Name').click();
    el('orgNameInput')
      .find('input')
      .clear()
      .type(newOrgName);
    el('orgNameSubmit').click();

    el('orgHeader').should('contain', newOrgName);
    el('headerMoreDropdown').should('contain', newOrgName);

    // Add Variable
    el('variableName')
      .find('input')
      .type('TestVariable');
    el('variableValue')
      .find('input')
      .type('Test');
    el('variableAdd').click();

    el('variableFormField').should('contain', 'TestVariable');

    addMailgunIntegration();
    addPostalIntegration();
    addSeedlistIntegration();

    // Delete
    el('orgDeleteButton').click();
    const stub = cy.stub();
    stub.onFirstCall().returns(true);
    cy.on('window:confirm', stub);

    el('headerMoreDropdown').should('contain', 'More');
  });
});
