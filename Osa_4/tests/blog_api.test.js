const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const helper = require('./test_helper')

const api = supertest(app)

// tietokanta resetointi
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// GET testit
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog id is named id, not _id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert(blog.id !== undefined)
  assert(blog._id === undefined)
})

// POST testi
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test blog from test',
    author: 'Kirsikka',
    url: 'http://example.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  // määrä kasvaa
  assert.strictEqual(
    blogsAtEnd.length,
    helper.initialBlogs.length + 1
  )

  // sisältö löytyy
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Test blog from test'))
})

// suljetaan tietokanta
after(async () => {
  await mongoose.connection.close()
})