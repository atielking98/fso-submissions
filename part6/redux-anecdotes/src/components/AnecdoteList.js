

import { useDispatch, useSelector } from 'react-redux'
import { voteOn } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({anecdotes, notifications, filter}) => {
      if (filter === '') {
        return anecdotes
      } else {
        return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      }
    })

    const vote = (id) => {
        console.log('vote', id)
        dispatch(voteOn(id))
        const anecdote = anecdotes.find(anecdote => anecdote.id === id).content
        const content = `you voted on the anecdote '${anecdote}'`
        dispatch(setNotification(content))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
      }

    return (
        <div>{[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}</div>)
}

export default AnecdoteList