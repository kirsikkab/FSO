const Blog = require('../models/blog')
const User = require('../models/user')

//  blog testidata
const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author 1',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Author 2',
    url: 'http://example.com/2',
    likes: 3
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const initialUsers = [
  {
    username: 'root',
    name: 'Superuser'
  }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb
}