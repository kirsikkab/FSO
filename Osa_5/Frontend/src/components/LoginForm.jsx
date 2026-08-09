import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword
}) => {
  return (
    <Box sx={{ maxWidth: 400, mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Log in to application
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          label="username"
          variant="standard"
          fullWidth
          margin="normal"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <TextField
          label="password"
          type="password"
          variant="standard"
          fullWidth
          margin="normal"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          LOGIN
        </Button>
      </Box>
    </Box>
  )
}

export default LoginForm