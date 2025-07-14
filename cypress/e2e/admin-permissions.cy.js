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

    cy.request('POST', `${api}/auth/register`, {
      name: 'Admin',
      email: adminEmail,
      password,
      role: 'ADMIN',
    })
      .then((res) => {
        adminId = res.body.user.id;
        cy.wrap(adminId).as('adminId');

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
          .its('body.token'),
      )
      .then((token) => {
        adminToken = token;
        cy.wrap(adminToken).as('adminToken');

        return cy
          .request('POST', `${api}/auth/login`, {
            email: memberEmail,
            password,
          })
          .its('body.token');
      })
      .then((token) => {
        memberToken = token;
        cy.wrap(memberToken).as('memberToken');

        return cy.request({
          method: 'POST',
          url: `${api}/teams`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { name: `Team ${timestamp}` },
        });
      })
      .then((res) => {
        teamId = res.body.id;
        cy.wrap(teamId).as('teamId');
      });
  });

  it('rejects team creation by non-admin', () => {
    cy.get('@' + 'memberToken').then((token) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/teams`,
        headers: { Authorization: `Bearer ${token}` },
        body: { name: `Nope ${timestamp}` },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 403);
    });
  });

  it('rejects board creation by non-admin', () => {
    cy.get('@' + 'memberToken').then((token) => {
      cy.get('@' + 'teamId').then((tId) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/teams/${tId}/boards`,
          headers: { Authorization: `Bearer ${token}` },
          body: { title: 'New Board' },
          failOnStatusCode: false,
        })
          .its('status')
          .should('eq', 403);
      });
    });
  });

  it('rejects invites by non-admin', () => {
    cy.get('@' + 'memberToken').then((token) => {
      cy.get('@' + 'teamId').then((tId) => {
        cy.get('@' + 'adminId').then((aId) => {
          cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/teams/${tId}/invite`,
            headers: { Authorization: `Bearer ${token}` },
            body: { userId: aId },
            failOnStatusCode: false,
          })
            .its('status')
            .should('eq', 403);
        });
      });
    });
  });
});
