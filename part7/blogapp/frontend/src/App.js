import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import { createNotification } from './reducers/notificationReducer'
import { initializeBlogs, like, deleteBlog, create } from './reducers/blogReducer'
import blogService from './services/blogs'


import Togglable from './components/Togglable'

import loginService from './services/login'
import userService from './services/user'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password
      })
      .then((user) => {
        console.log(user)
        setUser(user)
        userService.setUser(user)
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const createBlog = async (blog) => {
    dispatch(create(blog))
    blogFormRef.current.toggleVisibility()
    const message = `a new blog '${blog.title}' by ${blog.author} added`
    notify(message)
  }

  const removeBlog = (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    const ok = window.confirm(
      `remove '${blog.title}' by ${blog.author}?`
    )

    if (!ok) {
      return
    }

    dispatch(deleteBlog(id))
    const message = `Blog ${blog.title} successfully deleted`
    notify(message)
  }

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id
    }
    const message = `Blog ${liked.title} successfully liked`
    dispatch(like(liked))
    notify(message)
  }

  const notify = (message, type = 'info') => {
    dispatch(createNotification({"message": message, "type": type}, 5000))
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <div id="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
      </div>
    </div>
  )
}

export default App
