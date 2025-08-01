const timestamp = Date.now(); // chỉ gọi 1 lần, dùng chung cho toàn file
const password = 'pass123';

describe('Auth Feature (UI)', () => {
  const email = `test${timestamp}@example.com`;

  it('registers a new user via UI', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/register');
    cy.url().should('include', '/teams');
  });

  it('logs in the user via UI', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/teams');
    cy.contains('Team Management');
  });
});

describe('Navbar UI Based on Auth State', () => {
  const email = `test${timestamp}+nav@example.com`;

  before(() => {
    cy.register('Test User', email, password);
  });

  it('shows Login and Register before login', () => {
    cy.visit('/');
    cy.contains('Login').should('exist');
    cy.contains('Register').should('exist');
    cy.contains('Logout').should('not.exist');
  });

  it('shows Logout after login', () => {
    cy.login(email, password);
    cy.visit('/');

    cy.contains('Logout').should('exist');
    cy.contains('Login').should('not.exist');
    cy.contains('Register').should('not.exist');
  });
});
