import { el, selectBroadwingOrg } from '../support/commands';

describe('Templates', () => {
  it('Checks template existence', () => {
    selectBroadwingOrg();
    el('sidebar')
      .contains('Templates')
      .click();

    // Edit
    el('templateTable')
      .first('td')
      .click();
    cy.contains('Edit').click();
    cy.get('input[name="name"]')
      .clear()
      .type('Test Template');
    el('variableName')
      .find('input')
      .type('varName');
    el('variableValue')
      .find('input')
      .type('varValue');
    el('variableAdd').click();
    // @TODO verify label existence

    cy.contains('Save').click();
    el('templateName').should('contain', 'Test Template');

    // Clone
    cy.contains('Clone Template').click();
    cy.get('input[name="name"]').should('have.value', 'Test Template COPY');
  });
});
