import React from 'react'
import './filters.css'

export default function Filters({ search, onSearch, statusOptions = [], kabOptions = [], filters, onChange }) {
  return (
    <div className="filters">
      <label className="search">
        <span className="label">Search</span>
        <input aria-label="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search kode or nama..." />
      </label>

      <label>
        <span className="label">Status</span>
        <select value={filters.status || ''} onChange={(e) => onChange({ ...filters, status: e.target.value || null })}>
          <option value="">All</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label>
        <span className="label">Kabupaten</span>
        <select value={filters.kabupaten || ''} onChange={(e) => onChange({ ...filters, kabupaten: e.target.value || null })}>
          <option value="">All</option>
          {kabOptions.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>
    </div>
  )
}
