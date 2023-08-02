
const testname = 'TEST_TIME_TRACKING';
const first_estimate = '10'
const edit_estimate = '20'
const time_spent = '2'
const time_remaining = '5'

describe('Issue time tracking', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
        });
    });

    it('Should create issue and add/edit/remove time estimation', () => {

        //Create issue
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type('Test time tracking 10 hours')
            cy.get('input[name="title"]').type(testname)
            cy.get('button[type="submit"]').debounced('click');
        });
        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        cy.contains('Issue has been successfully created.').should('be.visible');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');
        cy.contains(testname).debounced('click');

        //Check that time estiomation is 0 and change it to 10h, assert
        cy.get('input[placeholder="Number"]').should('be.visible').should('be.empty').should('have.value', '');
        cy.contains('No time logged').should('be.visible')
        cy.get('input[placeholder="Number"]').click()
        cy.get('input[placeholder="Number"]').debounced('type', first_estimate);
        cy.contains(`${first_estimate}h estimated`).should('be.visible')
        cy.get('[data-testid="icon:close"]').click()
        //assert
        cy.contains(testname).click();
        cy.get('input[placeholder="Number"]').should('have.value', first_estimate);
        cy.contains(`${first_estimate}h estimated`).should('be.visible')

        //Edit time estimation to 20, assert
        cy.get('input[placeholder="Number"]').clear().debounced('type', edit_estimate);
        cy.contains(`${edit_estimate}h estimated`).should('be.visible')
        cy.contains(`${first_estimate}h estimated`).should('not.exist')
        cy.get('[data-testid="icon:close"]').click()
        //assert
        cy.contains(testname).click();
        cy.get('input[placeholder="Number"]').should('have.value', edit_estimate);
        cy.contains(`${edit_estimate}h estimated`).should('be.visible')
        cy.contains(`${first_estimate}h estimated`).should('not.exist')

        //Remove time estimation
        cy.get('input[placeholder="Number"]').debounced('clear')
        cy.contains(`${edit_estimate}h estimated`).should('not.exist')
        cy.get('[data-testid="icon:close"]').click()
        //assert
        cy.contains(testname).click();
        cy.get('input[placeholder="Number"]').should('be.visible').should('be.empty').should('have.value', '');
        cy.contains(`${edit_estimate}h estimated`).should('not.exist')
        //SYSTEM HAS A BUG - 20h estimation reappeares!!!
    });

    it('Should create issue and add/remove logged time', () => {

        //Create issue
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type('Test time logging')
            cy.get('input[name="title"]').type(testname)
            cy.get('button[type="submit"]').debounced('click');
        });
        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        cy.contains('Issue has been successfully created.').should('be.visible');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');
        cy.contains(testname).debounced('click');

        //Check that logged time is 0 and change it, assert
        cy.contains('No time logged').should('be.visible')
        cy.get('[data-testid="icon:stopwatch"]').click()
        cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]').first().click()
            cy.get('input[placeholder="Number"]').first().type(time_spent)
            cy.get('input[placeholder="Number"]').last().click()
            cy.get('input[placeholder="Number"]').last().type(time_remaining)
            cy.contains('Done').debounced('click')
        });
        //assert
        cy.contains('No time logged').should('not.exist')
        cy.contains(`${time_spent}h logged`).should('be.visible')
        cy.contains(`${time_remaining}h remaining`).should('be.visible')
        cy.get('[data-testid="icon:close"]').click()

        cy.contains(testname).click();
        cy.contains('No time logged').should('not.exist')
        cy.contains(`${time_spent}h logged`).should('be.visible')
        cy.contains(`${time_remaining}h remaining`).should('be.visible')

        //Remove logged time, assert
        cy.contains(`${time_spent}h logged`).should('be.visible')
        cy.get('[data-testid="icon:stopwatch"]').click()
        cy.get('[data-testid="modal:tracking"]').within(() => {
            cy.get('input[placeholder="Number"]').first().click()
            cy.get('input[placeholder="Number"]').first().clear()
            cy.get('input[placeholder="Number"]').last().click()
            cy.get('input[placeholder="Number"]').last().clear()
            cy.contains('Done').debounced('click')
        });
        cy.contains('No time logged').should('be.visible')
        cy.contains(`${time_spent}h logged`).should('not.exist')
        cy.contains(`${time_remaining}h remaining`).should('not.exist')
        cy.get('[data-testid="icon:close"]').click()
        //assert
        cy.contains(testname).click();
        cy.contains('No time logged').should('be.visible')
        cy.contains(`${time_spent}h logged`).should('not.exist')
        cy.contains(`${time_remaining}h remaining`).should('not.exist')

    });

});
