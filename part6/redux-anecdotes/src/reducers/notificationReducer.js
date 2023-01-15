import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notification: ''
}


const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
      setNotification(state, action) {
        return {...initialState, notification: action.payload}
      },
      removeNotification(state) {
        return {...initialState, notification: ''}
      }
    },
  })

  export const { setNotification, removeNotification } = notificationSlice.actions

  export const createNotification = (content, timeout) => {
    return async dispatch => {
        dispatch(setNotification(content))
        setTimeout(() => {
          dispatch(removeNotification())
        }, timeout)
    }
  }
  
  export default notificationSlice.reducer
