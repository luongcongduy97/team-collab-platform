Cypress.Commands.add('login', (email, password) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5555/api';
  cy.request('POST', `${apiUrl}/auth/login`, { email, password })
    .its('body.token')
    .then((token) => {
      window.localStorage.setItem('token', token);
    });
});

Cypress.Commands.add('register', (name, email, password, role = 'ADMIN') => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5555/api';
  cy.request('POST', `${apiUrl}/auth/register`, {
    name,
    email,
    password,
    role,
  });
});
