// Menu catalog page — SysteMAE Restaurant Management System
// Main view for managing menu categories, products and specifications

import { useState, useEffect } from 'react'
import ModalCategory from '../../components/carta/ModalCategoria'
import ModalSpecifications from '../../components/carta/ModalEspecificaciones'
import ModalProduct from '../../components/carta/ModalProducto'
import toast from 'react-hot-toast'
import {
  createCategory, createProduct, createSpecification,
  getCategories, getProducts, getSpecifications,
  deleteProduct, updateProduct
} from '../../services/api'

function MenuPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSpecificationsModal, setShowSpecificationsModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [search, setSearch] = useState('')

  // Load data from backend when page loads
  useEffect(() => {
    getCategories().then(res => { if (res.success) setCategories(res.data) })
    getProducts().then(res => { if (res.success) setProducts(res.data) })
    getSpecifications().then(res => { if (res.success) setSpecifications(res.data) })
  }, [])

  // Filter products by name as user types
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSaveCategory(newCategory) {
    const res = await createCategory(newCategory)
    if (res.success) {
      setCategories([...categories, res.data])
      toast.success('Category saved successfully')
    }
  }

  async function handleSaveSpecification(newSpec) {
    const res = await createSpecification(newSpec)
    if (res.success) {
      setSpecifications([...specifications, res.data])
      toast.success('Specification added successfully')
    }
  }

  async function handleSaveProduct(newProduct) {
    const res = await createProduct(newProduct)
    if (res.success) {
      setProducts([...products, res.data])
      toast.success('Product saved successfully')
    }
  }

  async function handleUpdateProduct(updatedProduct) {
    const res = await updateProduct(updatedProduct.id, updatedProduct)
    if (res.success) {
      setProducts(products.map(p => p.id === updatedProduct.id ? res.data : p))
      toast.success('Product updated successfully')
    }
  }

  return (
    <div className="min-h-screen bg-bg-page">

      {/* Header */}
      <div className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catalog</h1>
          <p className="text-sm text-gray-500">Manage your restaurant's dishes and categories.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary w-52"
            />
          </div>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Category
          </button>
          <button
            onClick={() => setShowSpecificationsModal(true)}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Specifications
          </button>
          <button
            onClick={() => {
              setProductToEdit(null)
              setShowProductModal(true)
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            + New product
          </button>
        </div>
      </div>

      {/* Content — Products table */}
      <div className="px-8 py-6">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-6xl mb-4">🍽️</span>
            <p className="text-lg font-medium">
              {search ? 'No products found' : 'No products yet'}
            </p>
            <p className="text-sm">
              {search ? 'Try a different search term' : 'Start by adding a category and then a product'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Unit cost</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Sale price</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Supplies</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Specifications</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const category = categories.find(c => c.id === parseInt(product.categoryId))
                  return (
                    <tr key={product.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{category ? `${category.name} (${category.shift})` : '—'}</td>
                      <td className="px-6 py-4 text-gray-600">${product.unitCost || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">${product.salePrice}</td>
                      <td className="px-6 py-4 text-gray-600">{product.supplies || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.specifications.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            product.specifications.map(spec => (
                              <span key={spec.id} className="px-2 py-0.5 bg-primary-light text-primary text-xs rounded-full">
                                {spec.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setProductToEdit(product)
                              setShowProductModal(true)
                            }}
                            className="text-primary hover:text-primary-hover"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={async () => {
                              const res = await deleteProduct(product.id)
                              if (res.success) {
                                setProducts(products.filter(p => p.id !== product.id))
                                toast.error('Product deleted')
                              }
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <ModalCategory
          onClose={() => setShowCategoryModal(false)}
          onSave={handleSaveCategory}
        />
      )}
      {showSpecificationsModal && (
        <ModalSpecifications
          onClose={() => setShowSpecificationsModal(false)}
          specifications={specifications}
          onSave={handleSaveSpecification}
        />
      )}
      {showProductModal && (
        <ModalProduct
          onClose={() => {
            setShowProductModal(false)
            setProductToEdit(null)
          }}
          onSave={productToEdit ? handleUpdateProduct : handleSaveProduct}
          categories={categories}
          specifications={specifications}
          productToEdit={productToEdit}
        />
      )}

    </div>
  )
}

export default MenuPage