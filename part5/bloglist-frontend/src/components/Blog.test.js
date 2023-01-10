import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog post', () => {
  const mockHandler = jest.fn()
  const blog = {
    author: 'big bob',
    title: 'how to be big',
    url: 'www.bigboy.com',
    likes: 10,
    user: {
      username: 'root'
    }
  }

  const user = {
    username: 'root',
  }

  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} deleteBlog={() => {}} likeBlog={mockHandler} />).container
  })

  test('renders content', () => {
    const divInitial = container.querySelector('.initialDetails')
    expect(divInitial).toHaveStyle('display: block')
    const div = container.querySelector('.hiddenDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('renders more content when button clicked', async() => {
    const user = userEvent.setup()
    const displayButton = container.querySelector('.viewDetails')
    await user.click(displayButton)
    const div = container.querySelector('.hiddenDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('click like button twice', async() => {
    const user = userEvent.setup()
    const displayButton = container.querySelector('.viewDetails')
    await user.click(displayButton)
    const likeButton = container.querySelector('.likeBlog')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

