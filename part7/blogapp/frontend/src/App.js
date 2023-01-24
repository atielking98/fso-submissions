import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initializeUser, logoutUser } from './reducers/authReducer'
import { initializeAllUsers } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch
} from "react-router-dom"
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
    dispatch(initializeAllUsers())
  }, [dispatch])

  const blogMatch = useMatch('/blogs/:id')
  const foundBlog = blogMatch 
    ? blogs.find(blog => 
      blog.id === blogMatch.params.id
    )
    : null

  // const userMatch = useMatch('/users/:id')
  // const foundUser = userMatch 
  //   ? users.find(users => user.id === Number(userMatch.params.id))
  //   : null

  const logout = () => {
    dispatch(logoutUser())
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/blogs">blogs</Link>
          <Link style={padding} to="/users">users</Link>
          {user
            ? <div> <em>{user.name} logged in</em> <button onClick={logout}>logout</button> </div>
            : <LoginForm/>
          }
        </div>

        <Routes>
          <Route path="/blogs/:id" element={user ? <Blog blog={foundBlog} user={user} /> : <div></div>} />
          <Route path="/" element={user ? <Blogs blogs={blogs} user={user}/> : <div></div>} />
          <Route path="/blogs" element={<Blogs blogs={blogs} user={user}/>} />
          <Route path="/users" element={user ? <Users /> : <div></div>} />
        </Routes>
    </div>
  )
}

export default App