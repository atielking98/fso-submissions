import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blogs from './components/Blogs'
import Users from './components/Users'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initializeUser, logoutUser } from './reducers/authReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

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

      <Router>
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
          <Route path="/" element={user ? <Blogs user={user}/> : <div></div>} />
          <Route path="/blogs" element={<Blogs user={user}/>} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router> 
    </div>
  )
}

export default App
