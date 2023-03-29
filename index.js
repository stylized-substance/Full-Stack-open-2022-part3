require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// Create body token for morgan
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (request, response) => {
  let dateObject = new Date()
  response.send(`Phonebook has info for ${persons.length} people<br/><br/>${dateObject}`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})