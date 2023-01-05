const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

let user = null
let userToken = null

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = bcrypt.hashSync('sekret', 10)
  user = new User({ username: 'root', passwordHash })

  await user.save()

  // need to log in user!
  const login = {
    username: 'root',
    password: 'sekret'
  }

  const resultLogin = await api
    .post('/api/login')
    .send(login)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  userToken = 'bearer ' + resultLogin.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(Object.assign(helper.initialBlogs[0], { user:user.id }))
  await blogObject.save()
  blogObject = new Blog(Object.assign(helper.initialBlogs[1],  { user:user.id }))
  await blogObject.save()
})

describe('baseline blog contents', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog ID unique identifier', async() => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
    expect(blogs[0]._id).not.toBeDefined()
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'First class tests'
    )
  })

})

describe('add a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Big Bob',
      url: 'beep.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userToken) // Works.
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('blog without title or URL is not added', async () => {
    const newBlog = {
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userToken) // Works.
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('blog without likes uses default value', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Big Bob',
      url: 'beep.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userToken) // Works.
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    blogsAtEnd.forEach(blog => {
      if (blog.title === 'async/await simplifies making async calls') {
        expect(blog.likes).toEqual(0)
      }
    })

  }, 100000)
})

describe('view a blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('an invalid id cannot be viewed', async () => {
    await api
      .get('/api/blogs/6969')
      .expect(400)
  })
})

describe('delete a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', userToken) // Works.
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
  test('an invalid blog id cannot be deleted', async () => {
    await api
      .delete('/api/blogs/6969')
      .set('Authorization', userToken) // Works.
      .expect(400)
  })
  test('cannot delete a blog without a token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
  test('cannot delete a blog from another user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    const passwordHash = await bcrypt.hash('bingbong', 10)
    const badUser = new User({ username: 'bingbong', passwordHash })

    await badUser.save()

    const badLogin = {
      username: 'bingbong',
      password: 'bingbong'
    }
    const resultLogin = await api
      .post('/api/login')
      .send(badLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    let badUserToken = 'bearer ' + resultLogin.body.token
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', badUserToken) // Works.
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})