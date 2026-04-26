
require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

// muut pyynnöt, paitsi POST
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))

// POST-pyynnöt
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//kaikkien tietojen haku
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//info-sivu
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()

    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
  })
})

//yhden tiedon haku
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(() => {
      response.status(400).end()
    })
})

// tiedon poisto
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).end()
    })
})

// tiedon lisääminen
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        response.json(savedPerson)
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'something went wrong' })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})