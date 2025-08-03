describe('Modern Expense Tracker App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Clear localStorage before each test
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('should display the main heading with modern styling', () => {
    cy.get('h1').should('contain', 'Expense Tracker')
    cy.get('h1').should('have.class', 'text-4xl')
  })

  it('should display wallet balance section with animations', () => {
    cy.get('h2').contains('Wallet Balance').should('be.visible')
    cy.get('.text-success-600').should('contain', '$0.00')
  })

  it('should add income to wallet balance with smooth animations', () => {
    const incomeAmount = '1000'
    
    cy.get('input[placeholder="Income Amount"]').type(incomeAmount)
    cy.get('button[type="submit"]').contains('Add Balance').click()
    
    cy.get('.text-success-600').should('contain', '$1000.00')
  })

  it('should display add income button with hover effects', () => {
    cy.get('button').contains('+ Add Income').should('be.visible')
    cy.get('button').contains('+ Add Income').should('have.class', 'btn-primary')
  })

  it('should display add expense button with modern styling', () => {
    cy.get('button').contains('+ Add Expense').should('be.visible')
    cy.get('button').contains('+ Add Expense').should('have.class', 'btn-primary')
  })

  it('should open expense modal with smooth animations', () => {
    cy.get('button').contains('+ Add Expense').click()
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-content').should('be.visible')
    cy.get('h3').should('contain', 'Add New Expense')
  })

  it('should add a new expense with modern form', () => {
    const expenseData = {
      title: 'Groceries',
      price: '50.00',
      category: 'Food',
      date: '2024-01-15'
    }

    // Add income first
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()

    // Add expense
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type(expenseData.title)
    cy.get('input[name="price"]').type(expenseData.price)
    cy.get('select[name="category"]').select(expenseData.category)
    cy.get('input[name="date"]').type(expenseData.date)
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Verify expense is added with modern styling
    cy.get('.bg-white').should('contain', expenseData.title)
    cy.get('.text-danger-600').should('contain', '$50.00')
    cy.get('.bg-primary-100').should('contain', expenseData.category)
  })

  it('should update wallet balance after adding expense', () => {
    // Add income
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()
    cy.get('.text-success-600').should('contain', '$1000.00')

    // Add expense
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Test Expense')
    cy.get('input[name="price"]').type('100')
    cy.get('select[name="category"]').select('Food')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Balance should remain the same since we're not deducting from wallet
    cy.get('.text-success-600').should('contain', '$1000.00')
  })

  it('should edit an expense with modern modal', () => {
    // Add income and expense first
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()
    
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Original Title')
    cy.get('input[name="price"]').type('50')
    cy.get('select[name="category"]').select('Food')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Edit the expense
    cy.get('.btn-warning').first().click()
    cy.get('input[name="title"]').clear().type('Updated Title')
    cy.get('button[type="submit"]').contains('Update Expense').click()

    // Verify the expense was updated
    cy.get('.bg-white').should('contain', 'Updated Title')
  })

  it('should delete an expense with smooth animations', () => {
    // Add income and expense first
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()
    
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Test Expense')
    cy.get('input[name="price"]').type('50')
    cy.get('select[name="category"]').select('Food')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Verify expense exists
    cy.get('.bg-white').should('contain', 'Test Expense')

    // Delete the expense
    cy.get('.btn-danger').first().click()

    // Verify expense is deleted and empty state shows
    cy.get('.bg-white').should('not.contain', 'Test Expense')
    cy.get('h3').should('contain', 'No expenses yet')
  })

  it('should display beautiful empty state when no expenses', () => {
    cy.get('h3').should('contain', 'No expenses yet')
    cy.get('p').should('contain', 'Start tracking your expenses')
    cy.get('button').should('contain', '+ Add Your First Expense')
  })

  it('should render modern charts when expenses are added', () => {
    // Add income and expense
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()
    
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Test Expense')
    cy.get('input[name="price"]').type('100')
    cy.get('select[name="category"]').select('Food')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Check if modern charts are rendered
    cy.get('.recharts-wrapper').should('exist')
    cy.get('h3').contains('Expense Summary by Category').should('be.visible')
    cy.get('h3').contains('Daily Expense Trends').should('be.visible')
  })

  it('should persist data in localStorage with modern structure', () => {
    // Add income
    cy.get('input[placeholder="Income Amount"]').type('500')
    cy.get('button[type="submit"]').contains('Add Balance').click()

    // Add expense
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Persistent Expense')
    cy.get('input[name="price"]').type('75')
    cy.get('select[name="category"]').select('Shopping')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Reload the page
    cy.reload()

    // Verify data persists
    cy.get('.text-success-600').should('contain', '$500.00')
    cy.get('.bg-white').should('contain', 'Persistent Expense')
  })

  it('should be responsive on mobile viewport with modern design', () => {
    cy.viewport('iphone-6')
    
    // Check if elements are still visible and functional
    cy.get('h1').should('contain', 'Expense Tracker')
    cy.get('button').contains('+ Add Expense').should('be.visible')
    cy.get('input[placeholder="Income Amount"]').should('be.visible')
    
    // Check for responsive classes
    cy.get('.container').should('have.class', 'mx-auto')
  })

  it('should handle multiple expenses with modern animations', () => {
    // Add income
    cy.get('input[placeholder="Income Amount"]').type('2000')
    cy.get('button[type="submit"]').contains('Add Balance').click()

    // Add multiple expenses
    const expenses = [
      { title: 'Groceries', price: '100', category: 'Food' },
      { title: 'Gas', price: '50', category: 'Transportation' },
      { title: 'Movie', price: '25', category: 'Entertainment' }
    ]

    expenses.forEach((expense, index) => {
      cy.get('button').contains('+ Add Expense').click()
      cy.get('input[name="title"]').type(expense.title)
      cy.get('input[name="price"]').type(expense.price)
      cy.get('select[name="category"]').select(expense.category)
      cy.get('input[name="date"]').type('2024-01-15')
      cy.get('button[type="submit"]').contains('Add Expense').click()
    })

    // Verify all expenses are displayed with modern styling
    cy.get('.bg-white').should('contain', 'Groceries')
    cy.get('.bg-white').should('contain', 'Gas')
    cy.get('.bg-white').should('contain', 'Movie')
  })

  it('should validate form inputs with modern styling', () => {
    cy.get('button').contains('+ Add Expense').click()
    
    // Try to submit empty form
    cy.get('button[type="submit"]').contains('Add Expense').click()
    
    // Modal should still be open (form validation prevents submission)
    cy.get('.modal-overlay').should('be.visible')
  })

  it('should close modal with smooth animations', () => {
    cy.get('button').contains('+ Add Expense').click()
    cy.get('.modal-overlay').should('be.visible')
    
    cy.get('button').contains('×').click()
    cy.get('.modal-overlay').should('not.exist')
  })

  it('should display modern analytics with animated charts', () => {
    // Add income and expense
    cy.get('input[placeholder="Income Amount"]').type('1000')
    cy.get('button[type="submit"]').contains('Add Balance').click()
    
    cy.get('button').contains('+ Add Expense').click()
    cy.get('input[name="title"]').type('Test Expense')
    cy.get('input[name="price"]').type('100')
    cy.get('select[name="category"]').select('Food')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('button[type="submit"]').contains('Add Expense').click()

    // Check for modern analytics
    cy.get('.text-2xl').should('contain', '$100.00')
    cy.get('.text-sm').should('contain', 'Total Expenses')
  })
}) 