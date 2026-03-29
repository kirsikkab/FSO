import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
  phonebookService
    .getAll().then(data => {
    setPersons(data)
  })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
  setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
    person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (nameExists) {
      alert(`${newName} is already in the phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    phonebookService
    .create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    if (!person) return

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    phonebookService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(`${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const personsToShow = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
  <div>
    <h2>Phonebook</h2>

    <Filter 
      filter={filter} 
      handleFilterChange={handleFilterChange} 
    />

    <h3>add a new</h3>

    <PersonForm 
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
    />

    <h3>Numbers</h3>

    <Persons 
      persons={personsToShow} 
      handleDelete={handleDelete}
    />
  </div>
  )
}

export default App