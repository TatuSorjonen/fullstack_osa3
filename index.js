const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })}

app.use(express.json())
morgan.token('body', (req) => {
    return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-532523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
  ]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/info', (request, response) => {
    const info = 'Phonebook has info for ${persons.length} people'
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${new Date()}</p>`
      )
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name is missing' 
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number is missing' 
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number       
      }
    const personNames = persons.map(person => person.name)
    if (personNames.includes(person.name)) {
        return response.status(400).json({ 
            error: 'name is already in list' 
        })
    }
    console.log(persons.includes(person.name))
    
    persons = persons.concat(person)
    
    response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})