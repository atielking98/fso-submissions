import PropTypes from 'prop-types'

const BlogForm = ({ addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange,
  newURL, handleURLChange, newLikes, handleLikesChange }) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
            title: <input id='blog-title' placeholder="write blog title here" value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
            author: <input id='blog-author' value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
            url: <input id='blog-url' value={newURL} onChange={handleURLChange} />
        </div>
        <div>likes: <input id='blog-likes' value={newLikes} onChange={handleLikesChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  newTitle: PropTypes.string,
  handleTitleChange: PropTypes.func,
  newAuthor: PropTypes.string,
  handleAuthorChange: PropTypes.func,
  newURL: PropTypes.string,
  handleURLChange: PropTypes.func,
  newLikes: PropTypes.number,
  handleLikesChange: PropTypes.func
}


export default BlogForm