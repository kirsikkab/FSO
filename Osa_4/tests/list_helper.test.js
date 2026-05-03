const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

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