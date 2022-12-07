import { el, selectBroadwingOrg } from '../support/commands';

describe('Lists', () => {
  it('Adds a lists', () => {
    const newListName = `New List ${new Date().getTime()}`;

    selectBroadwingOrg();

    el('sidebar')
      .contains('Lists')
      .click();

    cy.get('button')
      .contains('Add List')
      .click();

    el('createListName')
      .find('input')
      .type(newListName);
    el('createListDescription')
      .find('input')
      .type('Test description');
    el('createListSubmit').click();

    el('listsTable')
      .contains(newListName)
      .click();

    // Edit
    cy.get('button')
      .contains('Edit')
      .click();
    cy.get('input[name="name"]')
      .clear()
      .type('Updated Test List');

    cy.get('input[name="description"]')
      .clear()
      .type('Updated Test Description');

    cy.get('button')
      .contains('Save')
      .click();
    el('listHeader').should('contain', 'Updated Test List');

    cy.get('button')
      .contains('Disable List')
      .click();
  });
});
