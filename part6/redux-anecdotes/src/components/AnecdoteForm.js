import { connect } from 'react-redux'
import { postAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    const content = `you added the anecdote '${anecdote}'`
    props.postAnecdote(anecdote)
    props.createNotification(content, 5000)
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

const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = {
  postAnecdote,
  createNotification
}


const ConnectedAnecdoteForm = connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm