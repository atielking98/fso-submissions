import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/authReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(loginUser(username, password))
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <div>
            <Form.Label>username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </div>
          <div>
            <Form.Label>password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </div>
          <Button id="login-button" variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm
