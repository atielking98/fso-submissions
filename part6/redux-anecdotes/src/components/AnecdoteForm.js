import { useDispatch } from 'react-redux'
import { postAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    const content = `you added the anecdote '${anecdote}'`
    dispatch(postAnecdote(anecdote))
    dispatch(createNotification(content, 5000))
  }
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote"/></div>
                <button type="submit">create</button>
            </form>
        </div>
    )
    
}

export default AnecdoteForm