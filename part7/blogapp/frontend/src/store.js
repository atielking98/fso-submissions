import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'

const Store = configureStore({
    reducer: {
      notification: notificationReducer,
      blogs: blogReducer
    }
  })

export default Store