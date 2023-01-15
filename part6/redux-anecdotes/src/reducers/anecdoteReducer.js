import { createSlice } from '@reduxjs/toolkit'
const getId = () => (100000 * Math.random()).toFixed(0)

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteOn(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1 
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )  
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { createAnecdote, voteOn, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer