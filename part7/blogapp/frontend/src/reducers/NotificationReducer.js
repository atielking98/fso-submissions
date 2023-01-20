import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions

let timeoutId = null

export const createNotification = (body, timeout) => {
  return dispatch => {
    dispatch(setNotification(body))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      dispatch(setNotification(null))
    }, timeout)
  }
}

export default notificationSlice.reducer