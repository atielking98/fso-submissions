import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select';
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'


const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [ changeBirthyear ] = useMutation(EDIT_BIRTHYEAR, 
    {refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  
  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')

    changeBirthyear({ variables: { name, setBornTo: born }})
    
    setName('')
    setBorn('')
  }

  const authors = props.authors

  const selectableOptions = 
    authors.map(author => {return {value: author.name, label: author.name}})

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      <br/>
      <h3>Set birthyear</h3>
      <div>
        <form onSubmit={submit}>
          <div>
            <Select
              className="input-cont"
              placeholder= "Select an individual"
              onChange={(target) => setName(target.value)}
              options={selectableOptions}
            />
          </div>
          <div>
            born
            <input required
              type="number" 
              value={born}
              onChange={({ target }) => setBorn(parseInt(target.value))}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
