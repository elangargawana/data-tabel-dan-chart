import React, { useMemo, useState } from "react";
import DataCardGrid from "../components/DataCardGrid"; // gunakan komponen kartu
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { generateUnits } from "../data/mockUnits";
import { useNavigate } from "react-router-dom";
import { toCSV } from "../utils/csv";

const columns = [
  { key: "kode", label: "Kode Unit" },
  { key: "nama", label: "Nama Proyek" },
  { key: "kabupaten", label: "Kabupaten/Kota" },
  { key: "status", label: "Status" },
  {
    key: "harga",
    label: "Harga",
    render: (v) => <span>Rp {v.toLocaleString("id-ID")}</span>,
  },
];

export default function DataPageGrid() {
  // Generate data mock
  const [data] = useState(() => generateUnits(1200));
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: null, kabupaten: null });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30); // tampilkan 30 kartu per halaman
  const [sortState, setSortState] = useState(null);
  const navigate = useNavigate();

  // Ambil opsi filter unik
  const statusOptions = useMemo(() => [...new Set(data.map((d) => d.status))], [data]);
  const kabOptions = useMemo(() => [...new Set(data.map((d) => d.kabupaten))], [data]);

  // Filter data
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return data.filter((row) => {
      if (filters.status && row.status !== filters.status) return false;
      if (filters.kabupaten && row.kabupaten !== filters.kabupaten) return false;
      if (!s) return true;
      return row.kode.toLowerCase().includes(s) || row.nama.toLowerCase().includes(s);
    });
  }, [data, search, filters]);

  // Sorting data
  const sorted = useMemo(() => {
    if (!sortState) return filtered;
    const { key, direction } = sortState;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return direction === "asc" ? va - vb : vb - va;
      return direction === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [filtered, sortState]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageStart = (page - 1) * perPage;
  const pageSlice = sorted.slice(pageStart, pageStart + perPage);

  return (
    <div className="page-wrapper">
      <div style={{ padding: 16 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <h2>Daftar Unit Perumahan - Jawa Tengah (Grid View)</h2>
          <p style={{ marginTop: 0, color: "var(--muted)" }}>Tampilkan daftar unit perumahan dalam format kartu grid, lengkap dengan filter dan pencarian.</p>
        </div>
        <div className="card">
          {/* Filter + Aksi */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Filters search={search} onSearch={setSearch} statusOptions={statusOptions} kabOptions={kabOptions} filters={filters} onChange={setFilters} />
            <div className="actions" style={{ display: "flex", gap: 8 }}>
              <button
                className="btn icon"
                onClick={() => {
                  const csv = toCSV(sorted, columns);
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "units.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                ⬇️ Export CSV
              </button>

              <button className="btn primary icon" onClick={() => navigate("/chart")}>
                📊 Lihat Chart
              </button>
            </div>
          </div>

          {/* Grid Cards */}
          {total === 0 ? (
            <div
              style={{
                padding: 20,
                background: "var(--card)",
                borderRadius: 8,
              }}
            >
              Tidak ada data yang cocok dengan filter.
            </div>
          ) : (
            <>
              <DataCardGrid
                columns={columns}
                data={pageSlice}
                sortable
                sortState={sortState}
                onSortChange={(s) => {
                  setSortState(s);
                  setPage(1);
                }}
                onRowClick={(r) => alert(`Klik ${r.kode} - ${r.nama} (${r.status})`)}
              />

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <Pagination
                  page={page}
                  perPage={perPage}
                  total={total}
                  onChange={(p, newPerPage) => {
                    if (newPerPage) {
                      setPerPage(newPerPage);
                      setPage(1);
                    } else setPage(p);
                  }}
                />
                <div style={{ color: "var(--muted)" }}>
                  Menampilkan {pageStart + 1} - {Math.min(pageStart + perPage, total)} dari {total} data
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
