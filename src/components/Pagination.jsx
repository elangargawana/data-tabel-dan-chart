import React from 'react'

export default function Pagination({ page, perPage, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">Prev</button>
      <span>Page {page} / {totalPages}</span>
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">Next</button>
      <label style={{ marginLeft: 12 }}>
        Per page
        <select value={perPage} onChange={(e) => onChange(1, Number(e.target.value))}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
    </div>
  )
}
