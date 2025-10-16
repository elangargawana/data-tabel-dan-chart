import React from "react";

export default function CardItem({ data }) {
  return (
    <div className="card">
      {/* Bisa tambahkan gambar placeholder */}
      <img src={data.image || "https://via.placeholder.com/300x200?text=Perumahan"} alt={data.nama} className="card-img" />

      <div className="card-body">
        <h3 className="card-title">{data.nama}</h3>
        <span className={`status ${data.status.toLowerCase()}`}>{data.status}</span>
        <p className="location">{data.kabupaten}</p>
        <p className="price">Rp {data.harga.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
}
