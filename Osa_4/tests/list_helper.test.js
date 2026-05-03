const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

//total likes
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Test blog',
      author: 'Test author',
      url: 'http://test.com',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://test1.com',
      likes: 5
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://test2.com',
      likes: 3
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://test3.com',
      likes: 7
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 15)
  })
})

//favorite blog
describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Only blog',
      author: 'Author',
      url: 'http://test.com',
      likes: 5
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://test1.com',
      likes: 5
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://test2.com',
      likes: 10
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://test3.com',
      likes: 7
    }
  ]

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)

    const expected = listWithManyBlogs[1]

    assert.deepStrictEqual(result, expected)
  })
})

//most blogs
describe('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert C. Martin',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      likes: 3
    },
    {
      title: 'Blog 3',
      author: 'Martin Fowler',
      likes: 7
    },
    {
      title: 'Blog 4',
      author: 'Robert C. Martin',
      likes: 2
    }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Edsger W. Dijkstra',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'Blog 3',
      author: 'Robert C. Martin',
      likes: 7
    }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)

    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(result, expected)
  })
})