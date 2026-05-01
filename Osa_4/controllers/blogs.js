const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET
blogsRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})

// POST
blogsRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog.save().then(result => {
    res.status(201).json(result)
  })
})

module.exports = blogsRouter