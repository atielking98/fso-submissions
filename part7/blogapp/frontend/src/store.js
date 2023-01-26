import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const Store = configureStore({
    reducer: {
      notification: notificationReducer,
      blogs: blogReducer,
      user: authReducer,
      users: userReducer
    }
  })

export default Store