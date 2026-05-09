const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  
  // GET TESTIT
  describe('fetching blogs', () => {

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
  })


  // POST TESTIT
  describe('addition of a new blog', () => {

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

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Test blog from test'))
    })

    test('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'No likes blog',
        author: 'Test',
        url: 'http://example.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()

      const addedBlog = blogsAtEnd.find(b => b.title === 'No likes blog')

      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'No title',
        url: 'http://example.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'No url',
        author: 'Test',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

describe('deletion of a blog', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)

    // poistettu blogi ei enää ole listassa
    assert(!ids.includes(blogToDelete.id))

    // määrä vähenee yhdellä
    assert.strictEqual(
      blogsAtEnd.length,
      helper.initialBlogs.length - 1
    )
  })
})

// Suljetaan tietokantayhteys testien jälkeen
after(async () => {
  await mongoose.connection.close()
})