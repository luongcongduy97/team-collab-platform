describe('Task Page (UI)', () => {
  const timestamp = Date.now();
  const email = `task${timestamp}@example.com`;
  const password = 'pass123';

  before(() => {
    cy.register('Task User', email, password);
  });

  beforeEach(() => {
    cy.login(email, password);
  });

  it('fetches and displays tasks', () => {
    cy.intercept('GET', '/api/boards/1/tasks', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Task A', status: 'todo' },
        { id: 2, title: 'Task B', status: 'done' },
      ],
    }).as('getTasks');

    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1', boards: [{ id: 1, title: 'Board 1' }], members: [] }],
    }).as('getTeams');

    cy.visit('/boards/1/tasks');
    cy.wait(['@getTasks', '@getTeams']);
    cy.contains('Task A').should('exist');
    cy.contains('Task B').should('exist');
  });

  it('creates a task successfully', () => {
    cy.intercept('GET', '/api/boards/1/tasks', { statusCode: 200, body: [] }).as('initialTasks');
    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1', boards: [{ id: 1, title: 'Board 1' }], members: [] }],
    }).as('getTeams');
    cy.intercept('POST', '/api/boards/1/tasks', {
      statusCode: 201,
      body: { id: 3, title: 'New Task', content: '', status: 'todo' },
    }).as('createTask');

    cy.visit('/boards/1/tasks');
    cy.wait(['@initialTasks', '@getTeams']);

    cy.get('input[label="Title"], input[placeholder="Title"], input').first().type('New Task');
    cy.contains('button', 'Add Task').click();

    cy.wait('@createTask');
    cy.contains('Task created');
    cy.contains('New Task').should('exist');
  });

  it('Edit an existing task', () => {
    cy.intercept('GET', '/api/boards/1/tasks', {
      statusCode: 200,
      body: [{ id: 1, title: 'Old Task', status: 'todo' }],
    }).as('getTasks');

    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1', boards: [{ id: 1, title: 'Board 1' }], members: [] }],
    }).as('getTeams');

    cy.intercept('PUT', '/api/boards/tasks/1', {
      statusCode: 200,
      body: { id: 1, title: 'Updated Task', status: 'todo', content: '' },
    }).as('updateTask');

    cy.visit('/boards/1/tasks');
    cy.wait(['@getTasks', '@getTeams']);

    cy.contains('button', 'Edit').click();
    cy.contains('label', 'Title')
      .invoke('attr', 'for')
      .then((inputId) => {
        cy.get(`#${inputId}`).clear();
        cy.get(`#${inputId}`).type('Updated Task');
      });

    cy.contains('button', 'Save').click();

    cy.wait('@updateTask');
    cy.contains('Updated Task').should('exist');
  });

  it('deletes a task', () => {
    cy.intercept('GET', '/api/boards/1/tasks', {
      statusCode: 200,
      body: [{ id: 1, title: 'Delete Me', status: 'todo' }],
    }).as('getTasks');
    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1', boards: [{ id: 1, title: 'Board 1' }], members: [] }],
    }).as('getTeams');
    cy.intercept('DELETE', '/api/boards/tasks/1', {
      statusCode: 204,
    }).as('deleteTask');

    cy.visit('/boards/1/tasks');
    cy.wait(['@getTasks', '@getTeams']);

    cy.contains('button', 'Delete').click();
    cy.wait('@deleteTask');
    cy.contains('Delete Me').should('not.exist');
  });

  it('assigns a user when creating a task', () => {
    cy.intercept('GET', '/api/boards/1/tasks', { statusCode: 200, body: [] }).as('initialTasks');
    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Team 1',
          boards: [{ id: 1, title: 'Board 1' }],
          members: [
            { id: 1, name: 'Member 1' },
            { id: 2, name: 'Member 2' },
          ],
        },
      ],
    }).as('getTeams');
    cy.intercept('POST', '/api/boards/1/tasks', (req) => {
      expect(req.body.assignedId).to.eq(1);
      req.reply({
        statusCode: 201,
        body: {
          id: 3,
          title: 'Assigned Task',
          content: '',
          status: 'todo',
          assigned: { id: 1, name: 'Member 1' },
        },
      });
    }).as('createTask');

    cy.visit('/boards/1/tasks');
    cy.wait(['@initialTasks', '@getTeams']);

    cy.get('input[label="Title"], input[placeholder="Title"], input').first().type('Assigned Task');
    cy.get('[data-testid="assign-select"]').click();
    cy.get('ul[role="listbox"]').contains('Member 1').click();
    cy.contains('button', 'Add Task').click();

    cy.wait('@createTask');
    cy.contains('Assigned Task').should('exist');
    cy.contains('Assigned: Member 1').should('exist');
  });

  it('changes task status', () => {
    cy.intercept('GET', '/api/boards/1/tasks', {
      statusCode: 200,
      body: [{ id: 1, title: 'Task A', status: 'todo' }],
    }).as('getTasks');
    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1', boards: [{ id: 1, title: 'Board 1' }], members: [] }],
    }).as('getTeams');
    cy.intercept('PUT', '/api/boards/tasks/1', (req) => {
      expect(req.body.status).to.eq('in-progress');
      req.reply({
        statusCode: 200,
        body: { id: 1, title: 'Task A', status: 'in-progress' },
      });
    }).as('updateStatus');

    cy.visit('/boards/1/tasks');
    cy.wait(['@getTasks', '@getTeams']);

    cy.get('[data-testid="status-select"]').click();
    cy.get('ul[role="listbox"]').contains('In Progress').click();

    cy.wait('@updateStatus');
    cy.get('[data-testid="status-select"]').should('contain', 'In Progress');
  });
});
