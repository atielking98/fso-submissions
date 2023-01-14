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
  export default notificationSlice.reducer
