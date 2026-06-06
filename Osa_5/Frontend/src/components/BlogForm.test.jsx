import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(
    <BlogForm createBlog={createBlog} />
  )

  // etsitään inputit
  const inputs = screen.getAllByRole('textbox')

  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  // kirjoitetaan kenttiin
  await user.type(titleInput, 'React toimii')
  await user.type(authorInput, 'M. Koiranen')
  await user.type(urlInput, 'https://example.com')

  // create-nappi
  const createButton = screen.getByText('create')

  await user.click(createButton)

  // handleria kutsuttu kerran
  expect(createBlog.mock.calls).toHaveLength(1)

  // tarkistetaan data
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React toimii',
    author: 'M. Koiranen',
    url: 'https://example.com'
  })
})