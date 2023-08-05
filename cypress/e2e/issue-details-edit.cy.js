describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');


  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  it("should check the priority dropdown options", () => {

    const getPriorityMenu = () => cy.get('[placeholder="Search"]').next();
    const expectedLength = 5;
    let priorityOptions = [];

    cy.get('[data-testid="select:priority"]').then((dropdown) => {
      const initialSelectedPriority = dropdown.text();
      priorityOptions.push(initialSelectedPriority);
      cy.log('Initial value:', initialSelectedPriority);

      cy.get('[data-testid="select:priority"]').click();

      getPriorityMenu().find('[data-select-option-value]').each((option) => {

        cy.wrap(option).invoke('text').then((optionText) => {

          priorityOptions.push(optionText);
          cy.log(`Added value: ${optionText}, Array length: ${priorityOptions.length}`);
        });

      }).then(() => {
        // Assert that the created array has the same length as the predefined number (expectedLength)
        cy.log('Final Array:', priorityOptions);
        expect(priorityOptions.length).to.equal(expectedLength);
      });
    });
  });

  it("should validate reporter name using regex", () => {

    const regexPattern = /^[A-Za-z\s]*$/;

    cy.get('[data-testid="select:reporter"]').invoke('text').then((reporterName) => {

      // Assert that the reporter name matches the regex pattern
      cy.wrap(reporterName).should('match', regexPattern);
      cy.log(`Reporter name "${reporterName}" contains only characters.`);
    });
  });

  it("should validate issue title on the board without leading and trailing spaces", () => {
    // Define the issue title with multiple spaces between words
    const title = '  This   is     a    test    for obsene     amount       of         spaces     ';
    const trimmedTitle = title.trim();

    cy.get('[data-testid="icon:close"]').first().click()
    cy.get('[data-testid="icon:plus"]').click()
    cy.get('input[name="title"]').type(title);
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload()
    cy.get('[data-testid="board-list:backlog"] [data-testid="list-issue"]').first().then((issueTitle) => {
      const issuetext = issueTitle.text().trim();
      // Assert that the issue title on the board matches the trimmed title
      cy.wrap(issuetext).should('eq', trimmedTitle);
    });
  });
});


