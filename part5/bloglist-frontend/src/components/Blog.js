const Blog =({blog, deleteBlog}) => {
  return (
    <li>
      <span><b>{blog.title}</b></span> by <span>{blog.author}</span> URL: <a id="url" target="_blank" rel="noopener noreferrer" href={blog.url}>{blog.url}</a> <span>{blog.likes} likes</span><button onClick={deleteBlog}>Delete</button>
    </li>
  )
}
export default Blog