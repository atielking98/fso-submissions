require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const Contact = require('./models/contact')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
  
    const contact = new Contact({
      name: body.name,
      number: body.number,
      date: new Date(),
    })
  
    contact.save().then(savedContact => {
      response.json(savedContact)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const contact = {
      name: body.name,
      number: body.number,
    }
  
    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
      .then(updatedContact => {
        response.json(updatedContact)
      })
      .catch(error => next(error))
  })

app.get('/api/info', (request, response) => {
  Contact.count({})
    .then(len => {
      response.send(`<p>Phonebook has info for ${len} people</p><p>${new Date()}</p>`)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
