import { useState, useEffect } from 'react'

function ModalProduct({ onClose, onSave, categories, specifications, productToEdit }) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [unitCost, setUnitCost] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [supplies, setSupplies] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [active, setActive] = useState(true)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name)
      setCategoryId(productToEdit.categoryId)
      setUnitCost(productToEdit.unitCost)
      setSalePrice(productToEdit.salePrice)
      setSupplies(productToEdit.supplies)
      setSelectedSpecs(productToEdit.specifications)
      setActive(productToEdit.active)
      setPhotoPreview(productToEdit.photo)
      setDescription(productToEdit.description)
    }
  }, [productToEdit])

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  function toggleSpec(spec) {
    if (selectedSpecs.find(s => s.id === spec.id)) {
      setSelectedSpecs(selectedSpecs.filter(s => s.id !== spec.id))
    } else {
      setSelectedSpecs([...selectedSpecs, spec])
    }
  }

  function handleSave() {
    if (!name.trim()) {
      alert('Product name is required')
      return
    }
    if (!categoryId) {
      alert('Please select a category')
      return
    }
    if (!salePrice) {
      alert('Sale price is required')
      return
    }
    onSave({
      id: productToEdit ? productToEdit.id : Date.now(),
      name,
      categoryId,
      unitCost,
      salePrice,
      supplies,
      specifications: selectedSpecs,
      active,
      photo: photoPreview,
      description,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {productToEdit ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="text-xs text-gray-400">
              {productToEdit ? 'Update the dish details' : 'Add a new dish to the menu'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Photo */}
        <div className="mb-4 flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-xl border-2 border-dashed border-border-input flex items-center justify-center overflow-hidden mb-2 cursor-pointer hover:border-primary"
            onClick={() => document.getElementById('photoInput').click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-2xl">📷</span>
                <span className="text-xs mt-1">Upload photo</span>
              </div>
            )}
          </div>
          <input id="photoInput" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
          <input
            type="text"
            placeholder="e.g. Beef tacos..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} — {cat.shift}
              </option>
            ))}
          </select>
        </div>

        {/* Costs */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit cost</label>
            <input
              type="number"
              placeholder="$ 0.00"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale price</label>
            <input
              type="number"
              placeholder="$ 0.00"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Supplies */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplies</label>
          <input
            type="text"
            placeholder="e.g. Tortilla, beef, onion..."
            value={supplies}
            onChange={(e) => setSupplies(e.target.value)}
            className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Describe the dish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Specifications */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
          {specifications.length === 0 ? (
            <p className="text-xs text-gray-400">No specifications available. Add them first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specifications.map(spec => (
                <button
                  key={spec.id}
                  onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedSpecs.find(s => s.id === spec.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-border-input hover:border-primary'
                  }`}
                >
                  {spec.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active toggle */}
        <div className="mb-6 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Active product</label>
          <button
            onClick={() => setActive(!active)}
            className={`w-12 h-6 rounded-full transition-all ${active ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-border-input rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            {productToEdit ? 'Save changes' : 'Save product'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalProduct