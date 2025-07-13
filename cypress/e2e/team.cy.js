describe('Team Management (UI)', () => {
  const timestamp = Date.now();
  const email = `team${timestamp}@example.com`;
  const password = 'pass123';
  const inviteEmail = `invite${timestamp}@example.com`;
  const teamName = `Team ${timestamp}`;

  before(() => {
    // Create user to be invited via API
    cy.register('Invite User', inviteEmail, password);

    // Register main user via UI
    cy.register('Test Owner', email, password);
  });

  it('creates a team and invites a user by email', () => {
    // Login as the registered user
    cy.login(email, password);
    cy.visit('/');

    cy.url().should('include', '/teams');
    cy.contains('Team Management');

    // Create a new team
    cy.get('input').first().type(teamName);
    cy.contains('button', 'Create Team').click();
    cy.contains(teamName).should('exist');

    // Invite another user by email
    cy.contains(teamName)
      .parent()
      .parent()
      .within(() => {
        cy.get('input').type(inviteEmail);
        cy.contains('button', 'Invite').click();
      });

    cy.contains('User invited successfully');
  });
});
