import { useState } from 'react'

function ModalSpecifications({ onClose, specifications, onSave }) {
  const [newSpec, setNewSpec] = useState('')

  function handleAdd() {
    if (!newSpec.trim()) {
      alert('Please enter a specification')
      return
    }
    if (specifications.find(s => s.name.toLowerCase() === newSpec.toLowerCase())) {
      alert('This specification already exists')
      return
    }
    onSave({ id: Date.now(), name: newSpec.trim() })
    setNewSpec('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Specifications</h2>
            <p className="text-xs text-gray-400">Add options like: No egg, No spicy...</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g. No onion, Gluten free..."
            value={newSpec}
            onChange={(e) => setNewSpec(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-border-input rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            + Add
          </button>
        </div>

        {/* Specifications list */}
        <div className="max-h-48 overflow-y-auto mb-6">
          {specifications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No specifications yet
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specifications.map(spec => (
                <span
                  key={spec.id}
                  className="flex items-center gap-1 px-3 py-1 bg-primary-light text-primary text-sm rounded-full"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2 border border-border-input rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Done
        </button>

      </div>
    </div>
  )
}

export default ModalSpecifications