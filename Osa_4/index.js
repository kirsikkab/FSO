require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

// MongoDB
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error:', error.message))

app.use(express.json())

// GET
app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

// POST
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})