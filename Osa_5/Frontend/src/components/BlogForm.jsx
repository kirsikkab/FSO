import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Box sx={{ maxWidth: 500, mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        create new
      </Typography>

      <Box component="form" onSubmit={addBlog}>
        <TextField
          label="title"
          fullWidth
          margin="normal"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />

        <TextField
          label="author"
          fullWidth
          margin="normal"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />

        <TextField
          label="url"
          fullWidth
          margin="normal"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          CREATE
        </Button>
      </Box>
    </Box>
  )
}

export default BlogForm