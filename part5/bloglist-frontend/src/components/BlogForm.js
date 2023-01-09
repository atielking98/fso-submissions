import PropTypes from 'prop-types'

const BlogForm = ({ addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange,
  newURL, handleURLChange, newLikes, handleLikesChange }) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
            title: <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
            author: <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
            url: <input value={newURL} onChange={handleURLChange} />
        </div>
        <div>likes: <input value={newLikes} onChange={handleLikesChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  newTitle: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  newAuthor: PropTypes.string.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  newURL: PropTypes.string.isRequired,
  handleURLChange: PropTypes.func.isRequired,
  newLikes: PropTypes.number.isRequired,
  handleLikesChange: PropTypes.func.isRequired
}


export default BlogForm