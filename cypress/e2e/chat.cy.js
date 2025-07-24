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

    // join-team should be emitted when the page loads
    cy.get('@emit').should('have.been.calledWithMatch', 'join-team', {
      teamId: '1',
    });

    // wait for the page to register socket listeners
    cy.wrap(null).should(() => {
      expect(socketStub.events['messages']).to.be.a('function');
    });

    // emit existing messages
    cy.then(() => {
      socketStub.events['messages']([{ id: 1, content: 'Hello there', user: { name: 'Tester' } }]);
    });

    cy.contains('Hello there').should('exist');

    cy.get('input[placeholder="Type a message"]').type('Howdy');
    cy.contains('button', 'Send').click();

    cy.get('@emit').should('have.been.calledWithMatch', 'send-message', {
      content: 'Howdy',
    });

    // simulate server broadcasting the new message
    cy.wrap(null).should(() => {
      expect(socketStub.events['new-message']).to.be.a('function');
    });

    cy.then(() => {
      socketStub.events['new-message']({
        id: 2,
        content: 'Howdy',
        user: { name: 'Chat User' },
      });
    });

    cy.contains('Chat User:').parent().contains('Howdy').should('exist');
  });
});
