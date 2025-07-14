describe('Admin permissions API', () => {
  const timestamp = Date.now();
  const adminEmail = `admin${timestamp}@example.com`;
  const memberEmail = `member${timestamp}@example.com`;
  const password = 'pass123';
  let adminToken;
  let memberToken;
  let adminId;
  let teamId;

  before(() => {
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      name: 'Admin',
      email: adminEmail,
      password,
    }).then((res) => {
      adminId = res.body.user.id;
    });

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      name: 'Member',
      email: memberEmail,
      password,
      role: 'MEMBER',
    });

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      email: adminEmail,
      password,
    }).then((res) => {
      adminToken = res.body.token;
    });

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      email: memberEmail,
      password,
    }).then((res) => {
      memberToken = res.body.token;
    });

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { name: `Team ${timestamp}` },
    }).then((res) => {
      teamId = res.body.id;
    });
  });

  it('rejects team creation by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams`,
      headers: { Authorization: `Bearer ${memberToken}` },
      body: { name: `Nope ${timestamp}` },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });

  it('rejects board creation by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams/${teamId}/boards`,
      headers: { Authorization: `Bearer ${memberToken}` },
      body: { title: 'New Board' },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });

  it('rejects invites by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams/${teamId}/invite`,
      headers: { Authorization: `Bearer ${memberToken}` },
      body: { userId: adminId },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });
});
