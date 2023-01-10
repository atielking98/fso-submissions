describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'mluukkai logged in')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()
    cy.contains('mluukkai logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('a blog created by cypress')
      cy.get('#blog-author').type('elon musk')
      cy.get('#blog-url').type('tesla.com')
      cy.get('#blog-likes').type(10)
      cy.contains('add').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'barack obama',
          likes: 69,
          url: 'barack.com'
        })
      })

      it('a blog can be liked', function() {
        cy.contains('another blog cypress')
          .parent()
          .find('button')
          .click()
        cy.contains('69 likes')
        cy.contains('like').click()
        cy.wait(1000)
        cy.contains('70 likes')
      })
      it('a blog can be deleted', function() {
        cy.contains('another blog cypress')
          .parent()
          .find('button')
          .click()
        cy.contains('Delete').click()
        cy.wait(1000)
        cy.get('html').should('not.contain', 'another blog cypress')
      })
      it('blogs are sorted by # of likes', function() {
        cy.createBlog({
          title: 'blog with most likes',
          author: 'barack obama',
          likes: 1000,
          url: 'barack.com'
        })
        cy.createBlog({
          title: 'blog with second most likes',
          author: 'barack obama',
          likes: 500,
          url: 'barack.com'
        })
        cy.get('.blog').eq(0).should('contain', 'blog with most likes')
        cy.get('.blog').eq(1).should('contain', 'blog with second most likes')
        cy.get('.blog').eq(2).should('contain', 'another blog cypress')
      })
    })
  })
})

