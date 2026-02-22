import React from 'react'
import { Search, Plus, RotateCcw } from 'lucide-react'

export function SearchBar({ value, onChange, onSearch, onClear, isLoading }) {
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search your saved content..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary-500 transition"
        />
        <Search className="absolute right-3 top-3 text-gray-400" size={20} />
      </div>
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition flex items-center gap-2"
      >
        Search
      </button>
      {value && (
        <button
          onClick={onClear}
          className="px-4 py-3 text-gray-600 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition"
        >
          <RotateCcw size={20} />
        </button>
      )}
    </div>
  )
}

export function FilterBar({ categories, platforms, selectedCategory, selectedPlatform, onCategoryChange, onPlatformChange }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary-500 text-sm"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={selectedPlatform || ''}
        onChange={(e) => onPlatformChange(e.target.value || null)}
        className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary-500 text-sm"
      >
        <option value="">All Platforms</option>
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-16">
      <Plus size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No content saved yet</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
