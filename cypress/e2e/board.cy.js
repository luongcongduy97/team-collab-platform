describe('Board Page (UI)', () => {
  const timestamp = Date.now();
  const email = `board${timestamp}@example.com`;
  const password = 'pass123';

  before(() => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('Board User');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains('Register success');
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });

  it('fetches and displays boards', () => {
    cy.intercept('GET', '/api/teams/1/boards', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Board A' },
        { id: 2, title: 'Board B' },
      ],
    }).as('getBoards');
    cy.visit('/teams/1/boards');
    cy.wait('@getBoards');
    cy.contains('Board A');
    cy.contains('Board B');
  });

  it('creates a board successfully', () => {
    cy.intercept('GET', '/api/teams/1/boards', { statusCode: 200, body: [] }).as('initialBoards');
    cy.intercept('POST', '/api/teams/1/boards', {
      statusCode: 201,
      body: { id: 3, title: 'New Board' },
    }).as('createBoard');

    cy.visit('/teams/1/boards');
    cy.wait('@initialBoards');

    cy.get('input[label="Board Title"], input[placeholder="Board Title"], input')
      .first()
      .type('New Board');
    cy.contains('button', 'Create').click();

    cy.wait('@createBoard');
    cy.contains('Board created successfully');
    cy.contains('New Board');
  });
});
