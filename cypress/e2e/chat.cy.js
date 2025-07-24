const password = 'pass123';

describe('Team Chat (UI)', () => {
  const timestamp = Date.now();
  const email = `chat${timestamp}@example.com`;

  before(() => {
    cy.register('Chat User', email, password);
  });

  beforeEach(() => {
    cy.login(email, password);
  });

  it('displays previous messages and sends a new message', () => {
    let socketStub;
    cy.visit('/teams/1/chat', {
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

    cy.then(() => {
      socketStub.events['messages']([{ id: 1, content: 'Hello there', user: { name: 'Tester' } }]);
    });

    cy.contains('Hello there').should('exist');

    cy.get('input[placeholder="Type a message"]').type('Howdy');
    cy.contains('button', 'Send').click();

    cy.get('@emit').should('have.been.calledWithMatch', 'send-message', {
      content: 'Howdy',
    });
  });
});
