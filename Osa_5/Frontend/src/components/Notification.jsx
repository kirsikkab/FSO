import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert sx={{ mt: 2, mb: 2 }} severity={message.type}>
      {message.text}
    </Alert>
  )
}

export default Notification