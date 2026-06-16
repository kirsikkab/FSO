import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const canDelete =
    blog.user &&
    user &&
    blog.user.username === user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">

      <div>
        {blog.title}

        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}

            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>

          <div>{blog.author}</div>

          {canDelete && (
            <button onClick={() => handleDelete(blog)}>
              remove
            </button>
          )}

        </div>
      )}

    </div>
  )
}

export default Blog