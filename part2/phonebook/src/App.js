import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Person =({person, deleteContact}) => {
  return (
    <li><span>{person.name}</span> <span>{person.number}</span> <button onClick={deleteContact}>Delete</button></li>
  )
}

const Persons = ({contactsToShow, deleteContact}) => {
  return (
    <ul>
      {contactsToShow.map(person => <Person key={person.name} person={person} deleteContact={deleteContact}/>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  }

  const deleteContact = (event) => {
    const name = event.target.parentElement.children[0].textContent;
    const toDeleteId = persons.find(person => person.name === name).id;
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deleteContact(toDeleteId)
        .then(() => {
          setPersons(persons.filter(person => person.id !== toDeleteId))
        })
    }
  }

  const addContact = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhone 
    }
    const foundPerson = persons.find(person => person.name === newName);
    if (foundPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(foundPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedPerson))
        })
      }
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
      })
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
      <Persons deleteContact={deleteContact} contactsToShow={contactsToShow}/>
    </div>
  )
}

export default App