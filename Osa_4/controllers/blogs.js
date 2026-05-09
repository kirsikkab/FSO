const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

// POST
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  // puuttuuko title tai url?
  if (!body.title || !body.url) {
    return res.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

// DELETE
blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter