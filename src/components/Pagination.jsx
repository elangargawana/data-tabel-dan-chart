import React, { useEffect, useState } from "react";

export default function Pagination({ page, perPage, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const [pageInput, setPageInput] = useState(String(page));

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  function commitPage(value) {
    let p = Number(value) || 1;
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    if (p !== page) onChange(p, perPage);
    setPageInput(String(p));
  }

  return (
    <nav className="pagination" role="navigation" aria-label="Pagination">
      <button className="pagination-btn" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">
        ‹ Prev
      </button>

      <div className="pagination-center">
        <label className="sr-only" htmlFor="page-input">
          Page number
        </label>
        <input
          id="page-input"
          className="pagination-input"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitPage(pageInput);
            if (e.key === "Escape") setPageInput(String(page));
          }}
          onBlur={(e) => commitPage(e.target.value)}
          inputMode="numeric"
          aria-label={`Page ${page} of ${totalPages}`}
        />
        <span className="pagination-total"> / {totalPages}</span>
      </div>

      <button className="pagination-btn" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">
        Next ›
      </button>

      <div className="pagination-perpage">
        <label htmlFor="per-page-select" className="perpage-label">
          Per page
        </label>
        <select id="per-page-select" className="pagination-select" value={perPage} onChange={(e) => onChange(1, Number(e.target.value))} aria-label="Items per page">
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </nav>
  );
}
