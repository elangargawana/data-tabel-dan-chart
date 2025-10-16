import React, { useMemo, useState } from "react";
import DataCardGrid from "../components/DataCardGrid"; // gunakan komponen kartu
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { generateUnits } from "../data/mockUnits";
import { useNavigate } from "react-router-dom";
import { toCSV } from "../utils/csv";
import FilterModal from "../components/FilterModal";

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
  const [showFilterModal, setShowFilterModal] = useState(false);
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
        <div className="card card-header" style={{ marginBottom: 16 }}>
          <h2
            style={{
              margin: 0,
              padding: 0,
              lineHeight: 1,
            }}
          >
            Daftar Unit Perumahan - Jawa Tengah
          </h2>
        </div>
        <div className="card">
          {/* Filter + Aksi */}
          {/* Search + Filter + Export + Chart */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Search box */}
            <input
              type="text"
              placeholder="Cari kode unit atau nama proyek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 240,
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 14,
              }}
            />

            {/* Tombol Filter */}
            <button
              className="btn icon"
              onClick={() => setShowFilterModal(true)}
              style={{
                background: "#6c63ff",
                color: "white",
                borderRadius: 6,
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}
            >
              🔽 Filter
            </button>

            {/* Tombol Export CSV */}
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
              style={{
                borderRadius: 6,
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}
            >
              ⬇️ Export CSV
            </button>

            {/* Tombol Chart */}
            <button
              className="btn primary icon"
              onClick={() => navigate("/chart")}
              style={{
                borderRadius: 6,
                padding: "8px 12px",
                background: "#28a745",
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              📊 Lihat Chart
            </button>
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
                onRowClick={(r) => navigate(`/detail/${r.kode}`)}
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
      <FilterModal show={showFilterModal} onClose={() => setShowFilterModal(false)} search={search} onSearch={setSearch} filters={filters} onChange={setFilters} statusOptions={statusOptions} kabOptions={kabOptions} />
    </div>
  );
}
