import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        )}
    </div>
  )
}

export default App