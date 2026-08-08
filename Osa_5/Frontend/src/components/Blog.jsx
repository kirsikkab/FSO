import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <li>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}
      </Link>
    </li>
  )
}

export default Blog