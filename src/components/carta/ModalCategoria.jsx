// Category modal — SysteMAE Restaurant Management System
// Form to create a new menu category

import { useState } from 'react'

function ModalCategory({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [shift, setShift] = useState('morning')

  function handleSave() {
    if (!name.trim()) {
      alert('Please enter a category name')
      return
    }
    onSave({ name, shift })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">New Category</h2>
            <p className="text-xs text-gray-400">Add a new category to the menu</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category name
          </label>
          <input
            type="text"
            placeholder="e.g. Breakfast, Salads..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Shift */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setShift('morning')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                shift === 'morning'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-border-input hover:border-primary'
              }`}
            >
              Morning
            </button>
            <button
              onClick={() => setShift('afternoon')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                shift === 'afternoon'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-border-input hover:border-primary'
              }`}
            >
              Afternoon
            </button>
          </div>
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
            Save category
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalCategory