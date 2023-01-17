import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notification: '',
    lastTimeoutId: null
}


const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
      setNotification(state, action) {
        if (state.lastTimeoutId !== null) {
          clearTimeout(state.lastTimeoutId)
        }
        return {...initialState, 
            notification: action.payload.notification, 
            lastTimeoutId: action.payload.lastTimeoutId
        }
      },
      removeNotification(state) {
        return {...initialState, notification: '', lastTimeoutId: null}
      }
    },
  })

  export const { setNotification, removeNotification } = notificationSlice.actions

  export const createNotification = (content, timeout) => {
    return async dispatch => {
        let timeoutId = setTimeout(() => {
          dispatch(removeNotification())
        }, timeout)
        dispatch(setNotification({notification: content, lastTimeoutId: timeoutId}))
    }
  }

  export default notificationSlice.reducer
