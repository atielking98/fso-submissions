const BlogForm = ({addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange,
    newURL, handleURLChange, newLikes, handleLikesChange}) => {
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

  export default BlogForm