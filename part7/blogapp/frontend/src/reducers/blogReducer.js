import blogService from '../services/blogs'
import { createNotification, setNotification } from '../reducers/notificationReducer'

const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1)

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.sort(byLikes)
    case 'NEW_BLOG':
      return state.concat(action.data).sort(byLikes)
    case 'DELETE_BLOG':
      return state.filter((blog) => blog.id !== String(action.data)).sort(byLikes)
    case 'LIKE': {
      const id = action.data.id
      const updatedBlog = state.find((blog) => blog.id === id)
      const changedBlog = {
        ...updatedBlog,
        likes: updatedBlog.likes + 1
      }
      return state.map((blog) => (blog.id !== id ? blog : changedBlog)).sort(byLikes)
    }
    case 'COMMENT':
      const id = action.data.id
      const updatedBlog = state.find((blog) => blog.id === id)
      const changedBlog = {
        ...updatedBlog,
        comments: action.data.comments
      }
      return state.map((blog) => (blog.id !== id ? blog : changedBlog)).sort(byLikes)
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const create = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
    } catch (exception) {
      dispatch(
        createNotification(`cannot create blog ${content.title}`, 'error', 5000)
      )
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch({
        type: 'DELETE_BLOG',
        data: id
      })
    } catch (exception) {
      dispatch(createNotification(`cannot delete blog`, 'error', 5000))
    }
  }
}

export const like = (likedBlog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(likedBlog.id, likedBlog)
      dispatch({
        type: 'LIKE',
        data: updatedBlog
      })
    } catch (exception) {
      dispatch(createNotification(`cannot update blog ${blog.title}`, 'error', 5000))
    }
  }
}

export const commentBlog = (commentedBlog) => {
    return async (dispatch) => {
      try {
        console.log(commentedBlog)
        const updatedBlog = await blogService.update(commentedBlog.id, commentedBlog)
        dispatch({
          type: 'COMMENT',
          data: updatedBlog
        })
      } catch (exception) {
        dispatch(createNotification(`cannot update blog ${commentedBlog.title}`, 'error', 5000))
      }
    }
  }

export default blogReducer