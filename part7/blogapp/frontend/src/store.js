import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/NotificationReducer'

const Store = configureStore({
    reducer: {
      notification: notificationReducer,
    }
  })

export default Store