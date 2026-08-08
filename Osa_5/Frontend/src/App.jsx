import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'



const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

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
      setMessage('wrong username or password')

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

      blogFormRef.current.toggleVisibility()

      setBlogs(prevBlogs =>
        prevBlogs.concat(blogWithUser)
      )

      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch {
      setMessage('error creating blog')

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

      setMessage(
        `blog ${blog.title} removed`
      )

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch {
      setMessage('error removing blog')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <div style={{ padding: 10, background: '#eee', marginBottom: 15 }}>
        <Link to="/" style={{ marginRight: 10 }}>
          blogs
        </Link>

        {!user && (
          <Link to="/login">
            login
          </Link>
        )}

        {user && (
          <>
            <span style={{ marginLeft: 10, marginRight: 10 }}>
              {user.name} logged in
            </span>

            <button onClick={handleLogout}>
              logout
            </button>
          </>
        )}
      </div>

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

      </Routes>
    </div>
  )
  

  
}

export default App