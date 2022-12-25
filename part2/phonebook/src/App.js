import { useState } from 'react'

const Filter = ({newSearch, handleSearchChange}) => {
  return (
    <div>
        filter shown with:<input value={newSearch} onChange={handleSearchChange}></input>
    </div>
  )
}

const Form = ({addContact, newName, handleNameChange, newPhone, handlePhoneChange}) => {
  return (
    <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number: <input value={newPhone} onChange={handlePhoneChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Person =({person}) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

const Persons = ({contactsToShow}) => {
  return (
    <ul>
      {contactsToShow.map(person => <Person key={person.name} person={person}/>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')
  


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  }

  const addContact = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhone 
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewPhone('')
    }
  }

  const contactsToShow = persons.filter(person => person.name.toLowerCase().startsWith(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <h2>Add a New Contact</h2>
      <Form addContact={addContact} newName={newName} 
        handleNameChange={handleNameChange} newPhone={newPhone} 
        handlePhoneChange={handlePhoneChange}/>
      <h2>Numbers</h2>
      <Persons contactsToShow={contactsToShow}/>
    </div>
  )
}

export default App