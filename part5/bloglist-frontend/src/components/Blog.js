import { useState } from 'react'

const Blog = ({ user, blogUsername, blog, deleteBlog, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(true)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div>
          <span>{blog.title}</span> by {blog.author} <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
      <div style={showWhenVisible}>
        <div>
          <span>{blog.title}</span> by {blog.author} <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>URL: <a id="url" target="_blank" rel="noopener noreferrer" href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button onClick={likeBlog}>like</button></div>
        {user.username === blogUsername && <button onClick={deleteBlog}>Delete</button>}
      </div>
  </div>
)}

export default Blog