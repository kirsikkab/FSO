const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


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

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  // validointi
  if (!body.title || !body.url) {
    return res.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  // liitetään blogi käyttäjälle
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
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

//DELETE
blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(403).json({
      error: 'only the creator can delete this blog'
    })
  }

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

module.exports = blogsRouter