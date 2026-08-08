import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'

describe('Blog component', () => {
  const blog = {
    title: 'Testing React',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 5,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '12345'
    }
  }

  test('shows blog details to a logged out user without buttons', () => {
    render(<BlogView blog={blog} />)

    expect(screen.getByText(/Testing React/)).toBeInTheDocument()
    expect(screen.getByText(/Michael Chan/)).toBeInTheDocument()
    expect(screen.getByText(/https:\/\/reactpatterns.com/)).toBeInTheDocument()
    expect(screen.getByText(/likes 5/)).toBeInTheDocument()

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows only like button to a logged in user who is not the creator', () => {
    const user = {
      username: 'someoneelse',
      name: 'Someone Else',
      id: '999'
    }

    render(
      <BlogView
        blog={blog}
        user={user}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows like and remove buttons to the blog creator', () => {
    const user = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '12345'
    }

    render(
      <BlogView
        blog={blog}
        user={user}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.getByText('remove')).toBeInTheDocument()
  })
})