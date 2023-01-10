import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, deleteBlog, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  console.log(blog)

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blog" style={blogStyle}>
      <div style={hideWhenVisible} className="initialDetails">
        <div>
          <span>{blog.title}</span> by {blog.author} <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
      <div style={showWhenVisible} className="hiddenDetails">
        <div>
          <span>{blog.title}</span> by {blog.author} <button className="viewDetails" onClick={toggleVisibility}>hide</button>
        </div>
        <div>URL: <a id="url" target="_blank" rel="noopener noreferrer" href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button className="likeBlog" onClick={likeBlog}>like</button></div>
        {user.username === blog.user.username && <button onClick={deleteBlog}>Delete</button>}
      </div>
    </div>
  )}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired,
}

export default Blog