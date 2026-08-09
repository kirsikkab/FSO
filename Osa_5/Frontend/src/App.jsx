import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'

import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography
} from '@mui/material'

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'



const App = () => {
  const navigate = useNavigate()

  const buttonStyle = {
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.2)'
    }
  }

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const BlogPage = () => {
    const { id } = useParams()

    const blog = blogs.find(b => b.id === id)

    return (
      <BlogView
        blog={blog}
        user={user}
        handleLike={handleLike}
        handleDelete={handleDelete}
      />
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')

    } catch {
      setMessage({
        text: 'wrong username or password',
        type: 'error'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        }
      }


      setBlogs(prevBlogs =>
        prevBlogs.concat(blogWithUser)
      )

      navigate('/')

      setMessage({
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch {
      setMessage({
        text: 'error creating blog',
        type: 'error'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,

      user: blog.user.id
    }

    const returnedBlog = await blogService.update(
      blog.id,
      updatedBlog
    )

    returnedBlog.user = blog.user

    setBlogs(
      blogs.map(b =>
        b.id !== blog.id ? b : returnedBlog
      )
    )
  }

  const handleDelete = async (blog) => {
    const ok = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!ok) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(
        blogs.filter(b => b.id !== blog.id)
      )

      navigate('/')

      setMessage({
        text: `blog ${blog.title} removed`,
        type: 'success'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch {
      setMessage({
        text: 'error removing blog',
        type: 'error'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <Container>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={buttonStyle}
          >
            BLOGS
          </Button>

          {!user && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={buttonStyle}
            >
              LOGIN
            </Button>
          )}

          {user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={buttonStyle}
              >
                NEW BLOG
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={buttonStyle}
              >
                LOGOUT
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

        <Notification message={message} />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2>blogs</h2>

                <ul>
                  {blogs
                    .slice()
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog =>
                      <Blog
                        key={blog.id}
                        blog={blog}
                      />
                    )}
                </ul>
              </div>
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <div>
                  <h2>Already logged in</h2>
                </div>
              ) : (
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              )
            }
          />

          <Route
            path="/blogs/:id"
            element={<BlogPage />}
          />

          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={addBlog} />
              ) : (
                <div>
                  <h2>Please log in first</h2>
                </div>
              )
            }
          />

        </Routes>
    </Container>
  )
  
}

export default App