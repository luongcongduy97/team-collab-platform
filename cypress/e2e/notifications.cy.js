const password = 'pass123';

describe('Notifications Page (UI)', () => {
  const timestamp = Date.now();
  const email = `notify${timestamp}@example.com`;

  before(() => {
    cy.register('Notify User', email, password);
  });

  beforeEach(() => {
    cy.login(email, password);
  });

  it('shows task notifications from socket events', () => {
    cy.intercept('GET', '/api/teams/my', {
      statusCode: 200,
      body: [{ id: 1, name: 'Team 1' }],
    }).as('getTeams');

    let socketStub;

    cy.visit('/notifications', {
      onBeforeLoad(win) {
        socketStub = {
          events: {},
          emit: cy.stub().as('emit'),
          on(event, cb) {
            this.events[event] = cb;
          },
          off() {},
        };
        win.io = () => socketStub;
      },
    });

    cy.wait('@getTeams');

    cy.get('@emit').should('have.been.calledWithMatch', 'join-team', {
      teamId: 1,
    });

    cy.wrap(null).should(() => {
      expect(socketStub.events['task-created']).to.be.a('function');
      expect(socketStub.events['task-updated']).to.be.a('function');
      expect(socketStub.events['task-deleted']).to.be.a('function');
    });

    cy.then(() => {
      socketStub.events['task-created']({ title: 'Task X' });
      socketStub.events['task-updated']({ title: 'Task X' });
      socketStub.events['task-deleted']();
    });

    cy.contains('New task "Task X" created').should('exist');
    cy.contains('Task "Task X" updated').should('exist');
    cy.contains('Task deleted').should('exist');
  });
});
