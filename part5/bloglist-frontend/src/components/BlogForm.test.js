import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async() => {
  const addBlog = jest.fn(e => e.preventDefault())

  render(<BlogForm addBlog={addBlog} />)
  const sendButton = screen.getByText('add')

  const user = userEvent.setup()

  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
})