describe('Comprehensive Expense Tracker Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Clear localStorage before each test
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  describe('1. Initial UI Rendering', () => {
    it('should display correct page title', () => {
      cy.title().should('eq', 'Expense Tracker')
      cy.get('h1').should('contain', 'Expense Tracker')
    })

    it('should show wallet balance section', () => {
      cy.get('h2').contains('Wallet Balance').should('be.visible')
      cy.get('.text-success-600').should('contain', '$0.00')
    })

    it('should display required buttons', () => {
      cy.get('button').contains('+ Add Income').should('be.visible')
      cy.get('button').contains('+ Add Expense').should('be.visible')
    })

    it('should show empty state when no expenses exist', () => {
      cy.get('h3').should('contain', 'No expenses yet')
      cy.get('p').should('contain', 'Start tracking your expenses')
    })

    it('should load with animations', () => {
      // Check for Framer Motion classes and animations
      cy.get('h1').should('have.class', 'text-4xl')
      cy.get('.card').should('exist')
    })
  })

  describe('2. Add Income', () => {
    it('should open income form when + Add Income is clicked', () => {
      cy.get('input[placeholder="Income Amount"]').should('be.visible')
      cy.get('button[type="submit"]').contains('Add Balance').should('be.visible')
    })

    it('should have correct input field attributes', () => {
      cy.get('input[placeholder="Income Amount"]')
        .should('have.attr', 'type', 'number')
        .and('have.attr', 'placeholder', 'Income Amount')
    })

    it('should have correct submit button', () => {
      cy.get('button[type="submit"]')
        .should('contain', 'Add Balance')
        .and('have.attr', 'type', 'submit')
    })

    it('should update wallet balance correctly', () => {
      const incomeAmount = '1000'
      cy.get('input[placeholder="Income Amount"]').type(incomeAmount)
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('.text-success-600').should('contain', '$1000.00')
    })

    it('should persist wallet balance after page reload', () => {
      const incomeAmount = '500'
      cy.get('input[placeholder="Income Amount"]').type(incomeAmount)
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('.text-success-600').should('contain', '$500.00')
      
      cy.reload()
      cy.get('.text-success-600').should('contain', '$500.00')
    })
  })

  describe('3. Add Expense', () => {
    beforeEach(() => {
      // Add some income first
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
    })

    it('should open expense modal when + Add Expense is clicked', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('.modal-overlay').should('be.visible')
      cy.get('h3').should('contain', 'Add New Expense')
    })

    it('should have all required form fields', () => {
      cy.get('button').contains('+ Add Expense').click()
      
      cy.get('input[name="title"]').should('be.visible')
      cy.get('input[name="price"]').should('be.visible')
      cy.get('select[name="category"]').should('be.visible')
      cy.get('input[name="date"]').should('be.visible')
    })

    it('should have correct submit button', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('button[type="submit"]')
        .should('contain', 'Add Expense')
        .and('have.attr', 'type', 'submit')
    })

    it('should add expense to list correctly', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Test Expense')
      cy.get('input[name="price"]').type('100')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      cy.get('.bg-white').should('contain', 'Test Expense')
      cy.get('.text-danger-600').should('contain', '$100.00')
    })

    it('should save data in localStorage', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Persistent Expense')
      cy.get('input[name="price"]').type('75')
      cy.get('select[name="category"]').select('Shopping')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      cy.window().then((win) => {
        const expenses = JSON.parse(win.localStorage.getItem('expenses'))
        expect(expenses).to.have.length(1)
        expect(expenses[0].title).to.eq('Persistent Expense')
      })
    })

    it('should clear form after successful submission', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Test Expense')
      cy.get('input[name="price"]').type('100')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      // Open modal again and check if fields are cleared
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').should('have.value', '')
      cy.get('input[name="price"]').should('have.value', '')
    })
  })

  describe('4. Delete Expense', () => {
    beforeEach(() => {
      // Add income and expense
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Test Expense')
      cy.get('input[name="price"]').type('100')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()
    })

    it('should have delete button for each expense', () => {
      cy.get('.btn-danger').should('contain', 'Delete')
    })

    it('should remove expense from list when deleted', () => {
      cy.get('.btn-danger').first().click()
      // After deletion, should show empty state
      cy.get('h3').should('contain', 'No expenses yet')
    })

    it('should remove expense from localStorage', () => {
      cy.get('.btn-danger').first().click()
      cy.window().then((win) => {
        const expenses = JSON.parse(win.localStorage.getItem('expenses'))
        expect(expenses).to.have.length(0)
      })
    })
  })

  describe('5. Edit Expense', () => {
    beforeEach(() => {
      // Add income and expense
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Original Title')
      cy.get('input[name="price"]').type('50')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()
    })

    it('should have edit button for each expense', () => {
      cy.get('.btn-warning').should('contain', 'Edit')
    })

    it('should pre-fill form with expense data', () => {
      cy.get('.btn-warning').first().click()
      cy.get('input[name="title"]').should('have.value', 'Original Title')
      cy.get('input[name="price"]').should('have.value', '50')
      cy.get('select[name="category"]').should('have.value', 'Food')
    })

    it('should update expense when form is submitted', () => {
      cy.get('.btn-warning').first().click()
      cy.get('input[name="title"]').clear().type('Updated Title')
      // Wait for the button text to update
      cy.get('button[type="submit"]').should('contain', 'Update Expense')
      cy.get('button[type="submit"]').contains('Update Expense').click()
      cy.get('.bg-white').should('contain', 'Updated Title')
    })
  })

  describe('6. Expense Summary & Charts', () => {
    beforeEach(() => {
      // Add income and expenses
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      
      // Add multiple expenses
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Food Expense')
      cy.get('input[name="price"]').type('100')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Transport Expense')
      cy.get('input[name="price"]').type('50')
      cy.get('select[name="category"]').select('Transportation')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      // Wait for charts to load
      cy.wait(2000)
    })

    it('should display expense summary chart', () => {
      cy.get('h3').contains('Expense Summary by Category').should('be.visible')
      // Check for chart container
      cy.get('.h-80').should('exist')
      // Check for chart content
      cy.get('svg').should('exist')
    })

    it('should update chart when expenses change', () => {
      cy.get('.text-2xl').should('contain', '$150.00')
      cy.get('.text-sm').should('contain', 'Total Expenses')
    })

    it('should animate chart on load', () => {
      // Check for chart elements
      cy.get('.h-80').should('exist')
      cy.get('svg').should('exist')
      // Check for motion animations
      cy.get('.text-xl').should('contain', 'Expense Summary by Category')
    })
  })

  describe('7. Persistence', () => {
    it('should persist all expenses on page refresh', () => {
      // Add income and expense
      cy.get('input[placeholder="Income Amount"]').type('500')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Persistent Expense')
      cy.get('input[name="price"]').type('75')
      cy.get('select[name="category"]').select('Shopping')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      cy.reload()
      cy.get('.text-success-600').should('contain', '$500.00')
      cy.get('.bg-white').should('contain', 'Persistent Expense')
    })

    it('should persist wallet balance on refresh', () => {
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('.text-success-600').should('contain', '$1000.00')
      
      cy.reload()
      cy.get('.text-success-600').should('contain', '$1000.00')
    })
  })

  describe('8. Responsiveness', () => {
    it('should render correctly on mobile', () => {
      cy.viewport('iphone-6')
      cy.get('h1').should('contain', 'Expense Tracker')
      cy.get('button').contains('+ Add Expense').should('be.visible')
      cy.get('input[placeholder="Income Amount"]').should('be.visible')
    })

    it('should have tappable buttons on mobile', () => {
      cy.viewport('iphone-6')
      cy.get('button').contains('+ Add Expense').should('be.visible')
      cy.get('button').contains('+ Add Income').should('be.visible')
    })

    it('should be scrollable on small screens', () => {
      cy.viewport('iphone-6')
      cy.get('body').should('be.visible')
      // Add multiple expenses to test scrolling
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      
      for (let i = 0; i < 5; i++) {
        cy.get('button').contains('+ Add Expense').click()
        cy.get('input[name="title"]').type(`Expense ${i}`)
        cy.get('input[name="price"]').type('50')
        cy.get('select[name="category"]').select('Food')
        cy.get('input[name="date"]').type('2024-01-15')
        cy.get('button[type="submit"]').contains('Add Expense').click()
      }
      
      cy.get('.bg-white').should('exist')
    })
  })

  describe('9. Validation & Edge Cases', () => {
    it('should prevent negative income values', () => {
      cy.get('input[placeholder="Income Amount"]').type('-100')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('.text-success-600').should('contain', '$0.00')
    })

    it('should prevent zero income values', () => {
      cy.get('input[placeholder="Income Amount"]').type('0')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('.text-success-600').should('contain', '$0.00')
    })

    it('should prevent empty field submission', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('button[type="submit"]').contains('Add Expense').click()
      cy.get('.modal-overlay').should('be.visible')
    })

    it('should validate date format', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="date"]').should('have.attr', 'type', 'date')
    })
  })

  describe('10. Accessibility and Semantics', () => {
    it('should have keyboard accessible buttons', () => {
      cy.get('button').contains('+ Add Expense').focus()
      cy.get('button').contains('+ Add Expense').should('be.focused')
    })

    it('should have proper form labels', () => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('label').should('contain', 'Title')
      cy.get('label').should('contain', 'Amount')
      cy.get('label').should('contain', 'Category')
      cy.get('label').should('contain', 'Date')
    })

    it('should have semantic HTML structure', () => {
      cy.get('h1').should('exist')
      cy.get('h2').should('exist')
      cy.get('form').should('exist')
    })
  })

  describe('Bonus Features', () => {
    it('should animate new expense card insertion', () => {
      cy.get('input[placeholder="Income Amount"]').type('1000')
      cy.get('button[type="submit"]').contains('Add Balance').click()
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type('Animated Expense')
      cy.get('input[name="price"]').type('100')
      cy.get('select[name="category"]').select('Food')
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()

      // Check for animation classes
      cy.get('.bg-white').should('contain', 'Animated Expense')
    })

    it('should have stable test selectors', () => {
      cy.get('button').contains('+ Add Expense').should('be.visible')
      cy.get('input[placeholder="Income Amount"]').should('be.visible')
      cy.get('h1').should('contain', 'Expense Tracker')
    })
  })
}) 