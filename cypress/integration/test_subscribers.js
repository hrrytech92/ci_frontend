import { el, selectBroadwingOrg } from '../support/commands';

describe('Subscribers', () => {
  it('Adds a subscriber', () => {
    selectBroadwingOrg();

    const email = `testsubscriber@test${new Date().getTime()}.com`;

    el('sidebar')
      .contains('Subscribers')
      .click();

    cy.get('button')
      .contains('Add Subscriber')
      .click();
    el('subscriberEmail')
      .find('input')
      .type(email);
    el('addSubscriberSubmit').click();

    el('subscribersTable')
      .contains(email)
      .click();

    el('variablesTextarea')
      .clear()
      .type('{');
    el('variablesTextarea').type('"custom": "data"}');
    cy.contains('Save').click();

    el('addSubscriberDropdown').click();

    el('addSubscriberDropdown')
      .find('[role="option"]')
      .click();

    el('subscriberTable').contains('Subscribed');
    el('subscribeCheckbox').click();
    el('subscriberTable').contains('Unsubscribed');
  });
});
