const express = require('express')
const router = express.Router()

// Temporary in-memory storage — will be replaced with PostgreSQL
let products = []


// Returns all products
router.get('/', (req, res) => {
  res.json({ success: true, data: products })
})


// Returns a single product by id
router.get('/:id', (req, res) => {
  const { id } = req.params
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }

  res.json({ success: true, data: product })
})


// Creates a new product
router.post('/', (req, res) => {
  const {
    name,
    categoryId,
    unitCost,
    salePrice,
    supplies,
    specifications,
    active,
    photo,
    description
  } = req.body

  // Validate required fields
  if (!name || !categoryId || !salePrice) {
    return res.status(400).json({
      success: false,
      message: 'Name, categoryId and salePrice are required'
    })
  }

  // Create new product object
  const newProduct = {
    id: Date.now(),
    name,
    categoryId,
    unitCost: unitCost || 0,
    salePrice,
    supplies: supplies || '',
    specifications: specifications || [],
    active: active !== undefined ? active : true,
    photo: photo || null,
    description: description || '',
    createdAt: new Date()
  }

  products.push(newProduct)

  res.status(201).json({ success: true, data: newProduct })
})


// Updates an existing product
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = products.findIndex(p => p.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }

  // Update product keeping existing values if not provided
  products[index] = { ...products[index], ...req.body }

  res.json({ success: true, data: products[index] })
})


// Deletes a product
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = products.findIndex(p => p.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }

  products.splice(index, 1)

  res.json({ success: true, message: 'Product deleted successfully' })
})

module.exports = router