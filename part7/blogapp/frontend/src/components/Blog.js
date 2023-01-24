import { useDispatch } from 'react-redux'
import { like, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import {
  useNavigate
} from 'react-router-dom'

const BlogDetails = ({ blog, own }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notify = (message, type = 'info') => {
    dispatch(createNotification({"message": message, "type": type}, 5000))
  }

  const removeBlog = (id) => {
    const ok = window.confirm(
      `remove '${blog.title}' by ${blog.author}?`
    )

    if (!ok) {
      return
    }

    dispatch(deleteBlog(id))
    navigate('/')
    const message = `Blog ${blog.title} successfully deleted`
    notify(message)
  }

  const likeBlog = () => {
    const liked = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user.id
    }
    const message = `Blog ${liked.title} successfully liked`
    dispatch(like(liked))
    notify(message)
  }

  const handleComment = (e) => {
    e.preventDefault()
    const comment = e.target.comment.value
    const commented = {
      ...blog,
      comments: blog.comments.concat(comment),
      user: blog.user.id
    }
    const message = `Blog ${commented.title} successfully commented on`
    dispatch(commentBlog(commented))
    notify(message)
  }

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'

  return (
    <div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <button onClick={() => likeBlog()}>like</button>
      </div>
      added by {addedBy}
      {own && <button onClick={() => removeBlog(blog.id)}>remove</button>}
      <h4>Comments</h4>
      <form onSubmit={handleComment}>
        <input id="comment" type="text" name="comment" />
        <button id="comment-button" type="submit">
          add comment
        </button>
      </form>
      <ul>
        {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
      </ul>
    </div>
  )
}

const Blog = ({ blog, user }) => {
  if (!blog) {
    return null
  }

  return (
    <div className="blog">
      <h2>{blog.title} by {blog.author}</h2>
      <BlogDetails
        blog={blog}
        own={blog.user && user.username === blog.user.username}
      />
    </div>
  )
}

export default Blog
