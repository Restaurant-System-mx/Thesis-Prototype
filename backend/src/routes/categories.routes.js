const express = require('express')
const router = express.Router()


let categories = []

// Returns all categories
router.get('/', (req, res) => {
  res.json({ success: true, data: categories })
})

// Creates a new category
router.post('/', (req, res) => {
  const { name, shift } = req.body

  // Validate required fields
  if (!name || !shift) {
    return res.status(400).json({
      success: false,
      message: 'Name and shift are required'
    })
  }

  // Create new category object
  const newCategory = {
    id: Date.now(),
    name,
    shift, // 'morning' or 'afternoon'
    createdAt: new Date()
  }

  categories.push(newCategory)

  res.status(201).json({ success: true, data: newCategory })
})

// Updates an existing category
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, shift } = req.body

  // Find category index
  const index = categories.findIndex(c => c.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    })
  }

  // Update category
  categories[index] = { ...categories[index], name, shift }

  res.json({ success: true, data: categories[index] })
})

// Deletes a category
router.delete('/:id', (req, res) => {
  const { id } = req.params

  const index = categories.findIndex(c => c.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    })
  }

  categories.splice(index, 1)

  res.json({ success: true, message: 'Category deleted successfully' })
})

module.exports = router