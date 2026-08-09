import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material'

const BlogView = ({ blog, user, handleLike, handleDelete }) => {
  if (!blog) {
    return <div>blog not found</div>
  }

  const canDelete =
    blog.user &&
    user &&
    blog.user.username === user.username

  return (
    <Card sx={{ mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          by {blog.author}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Added by {blog.user?.name || blog.author}
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography>
            {blog.likes} likes
          </Typography>

          {user && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLike(blog)}
            >
              LIKE
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(blog)}
            >
              REMOVE
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default BlogView