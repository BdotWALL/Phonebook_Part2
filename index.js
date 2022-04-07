const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

//Step 7. Add the morgan middleware to your application for logging. 
// Configure it to log messages to your console based on the tiny configuration.
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :person'))

// Step 8. Configure morgan so that it also shows the data sent in HTTP POST requests:
morgan.token('person', (request) => {
if (request.method === 'POST') return JSON.stringify(request.body)
})


let phonebook = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]
// Step 1. Implement a Node application that returns a hardcoded list of phonebook entries 
// from the address http://localhost:3001/api/persons.
app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

// Step 2. Implement a page at the address http://localhost:3001/info that displays # of phonebook entries 
// and date/time
app.get('/info', (request, response) => {
    let ppl = phonebook.length
    const message =
        `<p>Phonebook has info for ${ppl} people</p>` +
        `<p>${new Date()}</p>`;
      response.send(message);   
})

// Step 3. Implement the functionality for displaying the information for a single phonebook entry
app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    
    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
}})


// Step 4. Implement functionality that makes it possible to delete a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})


// Steps 5 & 6. Expand the backend so that new phonebook entries can be added;
// Generate a new id for the phonebook entry with the Math.random function.
// Implement error handling for creating new entries
const generateId = () => {
    return Math.floor((Math.random() * 100) + 1)
  }
  
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  }

  for (var i = phonebook.length - 1; i > -1; i--) {
    if (phonebook[i].name === body.name) {
      return response.status(400).json({ 
        error: 'The name already exists in the phonebook' 
      })
  }}
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }


  phonebook = phonebook.concat(person)

  response.json(person)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)