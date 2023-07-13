describe('Issue delete', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    it('Should delete issue and assert, that issue is not displayed on the Jira board anymore', () => {
        //System finds delete button and confirms deleting the issue
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:trash"]').click();
        });
        //Confirmation
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').within(() => {
            cy.contains('Delete issue').click()
        });
        //System asserts the confirmation dialoge is not visible and issue is not on the Jira clone board anymore
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.reload();
        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
            //Assert that this list contains 3 issues and first element with tag p has specified text
            cy.get('[data-testid="list-issue"]')
              .should('have.length', '3')
              .first()
              .find('p')
              .contains("Click on an issue to see what's behind it.");
              cy.contains('This is an issue of type: Task.').should('not.exist');
          });

    });

    it('Should start the deleting issue process, but cancel this action.', () => {
        //System finds delete button and confirms deleting the issue
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:trash"]').click();
        });
        //Confirmation
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').within(() => {
            cy.contains('Cancel').click()
        });

        //System asserts the confirmation dialoge is not visible and issue is on the Jira clone board
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.contains('This is an issue of type: Task.').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="icon:close"]').first().click()
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');
        cy.contains('This is an issue of type: Task.').should('be.visible');

        cy.reload();
        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
            //Assert that this list contains 4 issues and first element with tag p has specified text
            cy.get('[data-testid="list-issue"]')
              .should('have.length', '4')
              .first()
              .find('p')
              .contains('This is an issue of type: Task.');
          });

    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

});
