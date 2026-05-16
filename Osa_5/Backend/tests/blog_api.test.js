const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

// 🔐 login helper
const loginAndGetToken = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'sekret'
    })

  return response.body.token
}

describe('when there are initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = new User({
      username: 'testuser',
      passwordHash
    })

    const savedUser = await user.save()

    // liitetään blogit käyttäjään
    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: savedUser._id
    }))

    await Blog.insertMany(blogsWithUser)
  })

  //  GET 
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

  //  POST 
  describe('addition of a new blog', () => {

    test('a valid blog can be added with token', async () => {
      const token = await loginAndGetToken()

      const newBlog = {
        title: 'Test blog from test',
        author: 'Kirsikka',
        url: 'http://example.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )
    })

    test('adding a blog fails with 401 if token is missing', async () => {
      const newBlog = {
        title: 'No token blog',
        author: 'Test',
        url: 'http://example.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length
      )
    })

    test('blog without title is not added', async () => {
      const token = await loginAndGetToken()

      const newBlog = {
        author: 'No title',
        url: 'http://example.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without url is not added', async () => {
      const token = await loginAndGetToken()

      const newBlog = {
        title: 'No url',
        author: 'Test',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  //  DELETE 
  describe('deletion of a blog', () => {

    test('succeeds with status code 204 if id is valid and user is owner', async () => {
      const token = await loginAndGetToken()

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length - 1
      )
    })
  })

  //  PUT 
  describe('updating a blog', () => {

    test('likes can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 10
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)

      assert.strictEqual(
        response.body.likes,
        blogToUpdate.likes + 10
      )
    })
  })
})

// suljetaan tietokanta
after(async () => {
  await mongoose.connection.close()
})