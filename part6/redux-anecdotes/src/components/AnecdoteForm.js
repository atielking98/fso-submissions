import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const create = (event) => {
    console.log('create anecdote')
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    const content = `you added the anecdote '${anecdote}'`
    dispatch(createAnecdote(anecdote))
    dispatch(setNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={create}>
                <div><input name="anecdote"/></div>
                <button type="submit">create</button>
            </form>
        </div>
    )
    
}

export default AnecdoteForm