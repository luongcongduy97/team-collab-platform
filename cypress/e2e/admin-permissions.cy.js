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
    const api = Cypress.env('apiUrl');

    return cy
      .request('POST', `${api}/auth/register`, {
        name: 'Admin',
        email: adminEmail,
        password,
        role: 'ADMIN',
      })
      .then((res) => {
        adminId = res.body.user.id;

        return cy.request('POST', `${api}/auth/register`, {
          name: 'Member',
          email: memberEmail,
          password,
          role: 'MEMBER',
        });
      })
      .then(() =>
        cy
          .request('POST', `${api}/auth/login`, {
            email: adminEmail,
            password,
          })
          .its('body.token')
      )
      .then((token) => {
        adminToken = token;

        return cy
          .request('POST', `${api}/auth/login`, {
            email: memberEmail,
            password,
          })
          .its('body.token');
      })
      .then((token) => {
        memberToken = token;

        return cy.request({
          method: 'POST',
          url: `${api}/teams`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { name: `Team ${timestamp}` },
        });
      })
      .then((res) => {
        teamId = res.body.id;
        Cypress.env({
          adminId,
          adminToken,
          memberToken,
          teamId,
        });
      });
  });


  it('rejects team creation by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams`,
      headers: { Authorization: `Bearer ${Cypress.env('memberToken')}` },
      body: { name: `Nope ${timestamp}` },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });

  it('rejects board creation by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams/${Cypress.env('teamId')}/boards`,
      headers: { Authorization: `Bearer ${Cypress.env('memberToken')}` },
      body: { title: 'New Board' },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });

  it('rejects invites by non-admin', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/teams/${Cypress.env('teamId')}/invite`,
      headers: { Authorization: `Bearer ${Cypress.env('memberToken')}` },
      body: { userId: Cypress.env('adminId') },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 403);
  });
});
