describe('Team Management (UI)', () => {
  const timestamp = Date.now();
  const email = `team${timestamp}@example.com`;
  const password = 'pass123';
  const inviteEmail = `invite${timestamp}@example.com`;
  const teamName = `Team ${timestamp}`;

  before(() => {
    // Create user to be invited via API
    cy.request('POST', 'http://localhost:5555/api/auth/register', {
      name: 'Invite User',
      email: inviteEmail,
      password,
    });

    // Register main user via UI
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Owner');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains('Register success');
  });

  it('creates a team and invites a user by email', () => {
    // Login as the registered user
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

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
