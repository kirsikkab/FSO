const BlogView = ({ blog, user, handleLike, handleDelete }) => {
  if (!blog) {
    return <div>blog not found</div>
  }

  const canDelete =
    blog.user &&
    user &&
    blog.user.username === user.username

  return (
    <div>
      <h2>
        {blog.title}
      </h2>

      <div>
        <a href={blog.url}>
          {blog.url}
        </a>
      </div>

      <div>
        likes {blog.likes}

        {user && (
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        )}
      </div>

      <div>
        Added by {blog.author}
      </div>

      {canDelete && (
        <button onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView