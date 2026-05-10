const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

// POST
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({
      error: 'title or url missing'
    })
  }

  // hae joku käyttäjä blogille
  const user = await User.findOne({})

  if (!user) {
    return res.status(400).json({ error: 'no users in database' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id   // 🔥 tärkeä
  })

  const savedBlog = await blog.save()

  // lisää blog käyttäjälle
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

// DELETE
blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// PUT (update)
blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const result = await Blog.findByIdAndUpdate(
    req.params.id,
    updatedBlog,
    { returnDocument: 'after', runValidators: true, context: 'query' }
  )

  if (result) {
    res.json(result)
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter