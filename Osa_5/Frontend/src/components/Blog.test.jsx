import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title but not url or likes by default', () => {
  const blog = {
    title: 'React toimii',
    author: 'M. Koiranen',
    url: 'https://example.com',
    likes: 7,
    user: {
      username: 'wuffe',
      name: 'Minni Koiranen',
    }
  }

  render(
    <Blog blog={blog} />
  )

  // title näkyy
  const titleElement = screen.getByText('React toimii')

  expect(titleElement).toBeDefined()

  // url ei näy
  const urlElement = screen.queryByText(
    'https://example.com'
  )

  expect(urlElement).toBeNull()

  // likes ei näy
  const likesElement = screen.queryByText('likes 7')

  expect(likesElement).toBeNull()
})