import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleUnits } from "../data/mockUnits";
import "./detail.css";

export default function DetailPage() {
  const { kode } = useParams();
  const navigate = useNavigate();
  const unit = sampleUnits.find((u) => u.kode === kode);

  // lightweight mock payment schemes and facilities
  const paymentSchemes = [["Cash Keras"], ["KPR - Bank (DP 10%)"], ["KPR - Subsidi (DP 5%)"], ["Cicilan 12 bulan"], ["Cicilan 24 bulan"]];

  const facilitiesList = [
    ["One Gate System", "Jalan Lingkungan", "Taman Bermain"],
    ["Security 24 Jam", "Minimarket", "Mushola"],
    ["Akses Jalan Utama", "Dekat Sekolah", "Area Olahraga"],
    ["Dekat Rumah Sakit", "Pusat Perbelanjaan", "Tempat Ibadah"],
  ];

  const scheme = unit ? paymentSchemes[unit.id % paymentSchemes.length] : paymentSchemes[0];
  const facilities = unit ? facilitiesList[unit.id % facilitiesList.length] : facilitiesList[0];

  if (!unit) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: 16 }}>
          <div className="card">
            <h2>Unit tidak ditemukan</h2>
            <p>Maaf, unit dengan kode {kode} tidak ditemukan.</p>
            <button onClick={() => navigate(-1)}>Kembali</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h2>Detail Unit</h2>
          <div className="detail-layout">
            <div className="detail-main">
              <h3 className="section-title">
                <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="none" fill="none" />
                </svg>
                Deskripsi
              </h3>
              <p style={{ color: "var(--muted)" }}>
                {unit.nama} merupakan hunian yang nyaman dan asri di wilayah {unit.kabupaten}. Unit ini saat ini berstatus <strong>{unit.status}</strong>. Harga saat ini tercantum di sebelah kanan. Untuk informasi lebih lanjut, silakan
                hubungi tim penjualan.
              </p>

              <hr className="section-divider" />
              <h4 className="section-title">
                <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M21 8H3v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Skema Pembayaran
              </h4>
              <ul>
                {scheme.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h4 className="section-title">
                <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2l4 4-4 4-4-4 4-4z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 14l6 6 6-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Fasilitas Lingkungan
              </h4>
              <ul>
                {facilities.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <h4 className="section-title">
                <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 7h18M7 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Rincian
              </h4>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 6, border: "1px solid #ececec", width: 160 }}>Kode</td>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>{unit.kode}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>Nama Proyek</td>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>{unit.nama}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>Kabupaten/Kota</td>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>{unit.kabupaten}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>Status</td>
                    <td style={{ padding: 6, border: "1px solid #ececec" }}>{unit.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <aside className="detail-sidebar">
              <h4>Informasi Proyek</h4>
              <ul style={{ paddingLeft: 18 }}>
                <li>
                  <strong>Nama Proyek:</strong> {unit.nama}
                </li>
                <li>
                  <strong>Kabupaten:</strong> {unit.kabupaten}
                </li>
                <li>
                  <strong>Status:</strong> {unit.status}
                </li>
                <li>
                  <strong>Harga:</strong> Rp {unit.harga.toLocaleString("id-ID")}
                </li>
              </ul>
              <div style={{ marginTop: 12 }}>
                <button className="btn primary large" onClick={() => alert(`Booking ${unit.kode}`)}>
                  Booking Unit
                </button>
              </div>
            </aside>
            <div className="detail-back">
              <button className="btn" onClick={() => navigate(-1)}>
                ← Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
