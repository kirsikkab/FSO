import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

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

  const showMessage = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${existingPerson.name} is already in the phonebook. Replace the old number with a new one?`
      )

      if (!confirmReplace) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      phonebookService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(p =>
              p.id !== existingPerson.id ? p : returnedPerson
            )
          )
          setNewName('')
          setNewNumber('')

          showMessage(`${returnedPerson.name}'s phonenumber was updated`, 'success')
        })
        .catch(error => {
          const errorMessage =
            error.response?.data?.error || 'Something went wrong'
          showMessage(errorMessage, 'error')
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    phonebookService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        showMessage(`Added ${returnedPerson.name}`, 'success')
      })
      .catch(error => {
        const errorMessage =
          error.response?.data?.error || 'Something went wrong'
        showMessage(errorMessage, 'error')
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
      setPersons(prevPersons =>
        prevPersons.filter(p => p.id !== id)
      )

      showMessage(`Deleted ${person.name} successfully`, 'success')
    })
    .catch(error => {
      showMessage(
        `${person.name} has already been removed from server`,
        'error'
      )

      setPersons(prevPersons =>
        prevPersons.filter(p => p.id !== id)
      )
    })
  }

  const personsToShow = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
  <div>
    <h2>Phonebook</h2>
    <Notification notification={notification} />

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