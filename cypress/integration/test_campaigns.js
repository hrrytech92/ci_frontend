import { el, selectBroadwingOrg } from '../support/commands';

function formSelector(name) {
  return el('editMessageForm').find(`[name="${name}"]`);
}

describe('Campaigns', () => {
  it('Adds a campaign', () => {
    selectBroadwingOrg();

    el('sidebar')
      .contains('Campaigns')
      .click();

    cy.get('button')
      .contains('Add Campaign')
      .click();
    el('addCampaignName')
      .find('input')
      .type('New Test Campaign');
    el('addCampaignSubmit').click();

    // Edit
    el('campaignsTable')
      .contains('New Test Campaign')
      .click();
    cy.contains('Edit').click();
    cy.get('input[name="name"]')
      .clear()
      .type('Updated Test Campaign');

    cy.contains('Save').click();
    cy.contains('Back').click();
    el('campaignHeaderName').should('contain', 'Updated Test Campaign');

    cy.get('button')
      .contains('Disable Campaign')
      .click();
  });

  it('Creates a new message', () => {
    selectBroadwingOrg();

    el('sidebar')
      .contains('Campaigns')
      .click();
    el('campaignsTable')
      .first('td')
      .click();

    // Add Message
    cy.contains('Add Message').click();
    formSelector('name').type('Test Message Name');
    formSelector('subject').type('Welcome!');
    formSelector('sender_name').type('mike');
    formSelector('sender_email').type('becky');
    el('template').click();
    cy.get('.visible .menu [role="option"]')
      .first()
      .click();

    el('list').click();
    cy.get('.visible .menu [role="option"]')
      .first()
      .click();

    el('segment').click();
    cy.get('.visible .menu [role="option"]')
      .first()
      .click();

    el('seedlists').click();
    cy.get('.visible .menu [role="option"]')
      .first()
      .click();

    cy.contains('Save').click({
      force: true,
    });
    el('messageHeader').should('contain', 'Test Message Name');
  });
});
