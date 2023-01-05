const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')


const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = bcrypt.hashSync('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }, 100000)

  test('creation fails without a username or password', async () => {
    const newUser = {
      name: 'Matti Luukkainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  }, 100000)

  test('creation fails with a username or password that is too short', async () => {
    const newUser = {
      name: 'Matti Luukkainen',
      username: 'bo',
      password: 'bo'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  }, 100000)

  test('creation fails with a username that already exists', async () => {
    const newUser = {
      name: 'Matti Luukkainen',
      username: 'root',
      password: 'bo'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  }, 100000)

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 100000)
})

afterAll(() => {
  mongoose.connection.close()
})