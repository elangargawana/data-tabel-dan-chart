import React, { useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { sampleUnits, generateUnits } from "../data/mockUnits";
import { useNavigate } from "react-router-dom";
import { toCSV } from "../utils/csv";

const columns = [
  { key: "kode", label: "Kode Unit", width: 140 },
  { key: "nama", label: "Nama Proyek", width: 220 },
  { key: "kabupaten", label: "Kabupaten/Kota", width: 160 },
  { key: "status", label: "Status", width: 120 },
  { key: "harga", label: "Harga", width: 180, render: (v) => <span>Rp {v.toLocaleString("id-ID")}</span> },
];

export default function DataPage() {
  // for testing performance with large data, generate many rows (but keep sample small by default)
  const [data] = useState(() => generateUnits(1200));
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: null, kabupaten: null });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sortState, setSortState] = useState(null);
  const navigate = useNavigate();

  const statusOptions = useMemo(() => [...new Set(data.map((d) => d.status))], [data]);
  const kabOptions = useMemo(() => [...new Set(data.map((d) => d.kabupaten))], [data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return data.filter((row) => {
      if (filters.status && row.status !== filters.status) return false;
      if (filters.kabupaten && row.kabupaten !== filters.kabupaten) return false;
      if (!s) return true;
      return row.kode.toLowerCase().includes(s) || row.nama.toLowerCase().includes(s);
    });
  }, [data, search, filters]);

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

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageStart = (page - 1) * perPage;
  const pageSlice = sorted.slice(pageStart, pageStart + perPage);

  return (
    <div className="page-wrapper">
      <div style={{ padding: 16 }}>
        <div className="card">
          <h2>Daftar Unit Perumahan - Jawa Tengah</h2>
          <p style={{ marginTop: 0, color: "var(--muted)" }}>Tampilkan daftar unit, filter, dan cari. Klik "Lihat Chart" untuk melihat ringkasan.</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v10" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 7l4-4 4 4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>{" "}
                Export CSV
              </button>
              <button className="btn primary icon" onClick={() => navigate("/chart")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 9l-6 6-3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>{" "}
                Lihat Chart
              </button>
            </div>
          </div>

          {total === 0 ? (
            <div style={{ padding: 20, background: "var(--card)", borderRadius: 8 }}>No data matches your filters.</div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={pageSlice}
                height={520}
                rowHeight={48}
                onRowClick={(r) => navigate(`/detail/${r.kode}`)}
                sortable
                sortState={sortState}
                onSortChange={(s) => {
                  setSortState(s);
                  setPage(1);
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
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
                  Menampilkan {pageStart + 1} - {Math.min(pageStart + perPage, total)} dari {total} baris
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
