const BASE_URL = 'http://localhost:3001/api'


export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`)
  return response.json()
}

export const createCategory = async (category) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  })
  return response.json()
}

export const updateCategory = async (id, category) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  })
  return response.json()
}

export const deleteCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}



export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`)
  return response.json()
}

export const createProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return response.json()
}

export const updateProduct = async (id, product) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return response.json()
}

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}



export const getSpecifications = async () => {
  const response = await fetch(`${BASE_URL}/specifications`)
  return response.json()
}

export const createSpecification = async (specification) => {
  const response = await fetch(`${BASE_URL}/specifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(specification)
  })
  return response.json()
}

export const deleteSpecification = async (id) => {
  const response = await fetch(`${BASE_URL}/specifications/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}