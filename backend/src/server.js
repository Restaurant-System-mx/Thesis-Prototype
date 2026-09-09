// Main server file 
// This file initializes the Express server and registers all routes

const express = require('express')
const cors = require('cors')

// Initialize Express application
const app = express()
const PORT = 3001

// Middleware 

app.use(express.json())

// Allow requests from the React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// Routes 

const categoriesRouter = require('./routes/categories.routes')
const productsRouter = require('./routes/products.routes')
const specificationsRouter = require('./routes/specifications.routes')

// Register routes with their base paths
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/specifications', specificationsRouter)


// endpoint to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

//Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})