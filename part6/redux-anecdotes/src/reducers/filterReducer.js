import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
      setFilter(state, action) {
        return action.payload
      }
    }
})

export const { setFilter } = filterSlice.actions

export const changeFilter = (filter) => {
    return async dispatch => {
      dispatch(setFilter(filter))
    }
}
  
export default filterSlice.reducer