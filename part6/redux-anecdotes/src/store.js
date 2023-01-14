import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const Store = configureStore({
    reducer: {
      anecdotes: reducer,
      notifications: notificationReducer,
      filter: filterReducer
    }
  })

export default Store