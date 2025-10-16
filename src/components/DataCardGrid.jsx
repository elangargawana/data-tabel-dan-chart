import React, { useEffect, useState } from "react";
import "./table.css";

export default function DataCardGrid({ columns = [], data = [], onRowClick, sortable = true, sortState, onSortChange }) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 640 : false);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 640);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSort = (colKey) => {
    if (!onSortChange) return;
    let next = { key: colKey, direction: "asc" };
    if (sortState && sortState.key === colKey && sortState.direction === "asc") next.direction = "desc";
    else if (sortState && sortState.key === colKey && sortState.direction === "desc") next = null;
    onSortChange(next);
  };

  console.log("DATA MASUK:", data);

  return (
    <div className="table-outer">
      <div className="table-header" role="region" aria-label="Table header">
        {columns.map((col) => {
          const isSortable = sortable && col.sortable !== false;
          const active = sortState && sortState.key === col.key;
          const dir = active ? sortState.direction : null;
          return (
            <div key={col.key} className={`th-card ${isSortable ? "sortable" : ""}`} onClick={() => isSortable && handleSort(col.key)}>
              {col.label} {isSortable && <span className="sort-indicator">{active ? (dir === "asc" ? "▲" : "▼") : "↕"}</span>}
            </div>
          );
        })}
      </div>

      <div
        className="card-grid"
        role="list"
        aria-label="Daftar unit perumahan"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          padding: "32px 60px", // kanan kiri lebih luas
          maxWidth: "1600px", // lebarkan area maksimal
          margin: "0 auto", // tetap rata tengah
        }}
      >
        {Array.isArray(data) && data.length > 0 ? (
          data.map((row, idx) => (
            <div
              key={idx}
              className="card"
              role="listitem"
              tabIndex={0}
              aria-label={`${row.kode} - ${row.nama}`}
              aria-describedby={row.harga ? `harga-${idx}` : undefined}
              onClick={() => onRowClick && onRowClick(row)}
              onKeyDown={(e) => e.key === "Enter" && onRowClick && onRowClick(row)}
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                padding: "16px",
                transition: "0.3s ease",
                cursor: "pointer",
              }}
            >
              <div className="card-body">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="card-field"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      fontSize: "14px",
                    }}
                  >
                    <strong style={{ color: "#333" }}>{col.label}:</strong>
                    <span style={{ color: "#555" }}>{col.render ? col.render(row[col.key], row) : row[col.key]}</span>
                  </div>
                ))}
              </div>

              {row.harga && (
                <div
                  id={`harga-${idx}`}
                  className="card-footer"
                  style={{
                    borderTop: "1px solid #eee",
                    marginTop: "8px",
                    paddingTop: "8px",
                    fontWeight: "bold",
                    color: "#16a34a",
                    textAlign: "right",
                  }}
                >
                  Rp {row.harga.toLocaleString("id-ID")}
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#888",
              padding: "20px",
            }}
          >
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
}
