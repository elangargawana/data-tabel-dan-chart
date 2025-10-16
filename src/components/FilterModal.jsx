import React from "react";

export default function FilterModal({ show, onClose, search, onSearch, filters, onChange, statusOptions, kabOptions }) {
  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: "90%",
          maxWidth: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>🔍 Filter & Sort Data</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Search:
            <input type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Cari kode atau nama..." style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </label>

          <label>
            Status:
            <select value={filters.status || ""} onChange={(e) => onChange({ ...filters, status: e.target.value || null })} style={{ width: "100%", padding: 8, marginTop: 4 }}>
              <option value="">Semua</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label>
            Kabupaten:
            <select value={filters.kabupaten || ""} onChange={(e) => onChange({ ...filters, kabupaten: e.target.value || null })} style={{ width: "100%", padding: 8, marginTop: 4 }}>
              <option value="">Semua</option>
              {kabOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "#6c63ff", color: "white", border: "none", borderRadius: 6 }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
