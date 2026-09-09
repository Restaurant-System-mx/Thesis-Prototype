const express = require('express')
const router = express.Router()


let specifications = []

// Returns all specifications
router.get('/', (req, res) => {
  res.json({ success: true, data: specifications })
})

// Creates a new specification
router.post('/', (req, res) => {
  const { name } = req.body

  // Validate required fields
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    })
  }

  // Check for duplicates
  const exists = specifications.find(
    s => s.name.toLowerCase() === name.toLowerCase()
  )

  if (exists) {
    return res.status(400).json({
      success: false,
      message: 'Specification already exists'
    })
  }

  const newSpecification = {
    id: Date.now(),
    name,
    createdAt: new Date()
  }

  specifications.push(newSpecification)

  res.status(201).json({ success: true, data: newSpecification })
})


// Updates an existing specification
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body

  const index = specifications.findIndex(s => s.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Specification not found'
    })
  }

  specifications[index] = { ...specifications[index], name }

  res.json({ success: true, data: specifications[index] })
})


// Deletes a specification
router.delete('/:id', (req, res) => {
  const { id } = req.params

  const index = specifications.findIndex(s => s.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Specification not found'
    })
  }

  specifications.splice(index, 1)

  res.json({ success: true, message: 'Specification deleted successfully' })
})

module.exports = router