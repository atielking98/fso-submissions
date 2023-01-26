import { createNotification } from './notificationReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'

const STORAGE_KEY = 'loggedBlogAppUser'

const authReducer = (state = [], action) => {
    switch (action.type) {
      case 'INIT_USER':
        return action.user
      case 'LOGIN':
        return action.user
      case 'LOGOUT':
        return action.user
      default:
        return state
    }
  }

  export const initializeUser = () => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return {
        type: 'INIT_USER',
        user: user
      }
    }
  
    return {
      type: 'INIT_USER',
      user: null
    }
  }
  
  export const loginUser = (username, password) => {
    return async (dispatch) => {
      try {
        const user = await loginService.login({username, password})
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch({
          type: 'LOGIN',
          user: user
        })
        const message = `${user.name} logged in!`
        dispatch(createNotification({"message": message, "type": "info"}, 5000))
      } catch {
        dispatch(createNotification({"message": "wrong username/password", "type": "alert"}, 5000))
      }
    }
  }
  
  export const logoutUser = () => {
    return async (dispatch) => {
      window.localStorage.removeItem(STORAGE_KEY)
      blogService.setToken(null)
      dispatch({
        type: 'LOGOUT',
        user: null
      })
      dispatch(createNotification({"message": "goodbye!", "type": "info"}, 5000))
   }
  }

  export default authReducer