import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'

const Store = configureStore({
    reducer: {
      notification: notificationReducer,
      blogs: blogReducer,
      user: authReducer
    }
  })

export default Store