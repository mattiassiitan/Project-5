describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should do following steps with new comment', () => {
        //add comment
        //assert, that comment is added and visible
        //edit comment
        //assert that updated comment is visible
        //remove comment
        //assert that comment is removed

        const commentname = 'TESTING_COMMENT_NAME';
        const editedcomment = 'TESTING_EDITED_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(commentname);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', commentname);


            cy.get('[data-testid="issue-comment"]').first().contains('Edit').click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]').should('contain', commentname).clear().type(editedcomment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.get('[data-testid="issue-comment"]').should('contain', 'Edit').and('contain', editedcomment);

            cy.contains('Delete').click();
        });

        cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment').click().should('not.exist');

        getIssueDetailsModal().contains(editedcomment).should('not.exist');
    });
});
