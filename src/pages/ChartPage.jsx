import React, { useMemo } from 'react'
import { generateUnits } from '../data/mockUnits'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#10b981', '#ef4444']

export default function ChartPage() {
  const data = generateUnits(500)
  const navigate = useNavigate()

  const byStatus = useMemo(() => {
    const map = new Map()
    data.forEach(d => map.set(d.status, (map.get(d.status) || 0) + 1))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [data])

  const priceByKab = useMemo(() => {
    const map = new Map()
    data.forEach(d => map.set(d.kabupaten, (map.get(d.kabupaten) || 0) + d.harga))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: Math.round(value / 1e6) })) // show in millions
  }, [data])

  return (
    <div className="page-wrapper">
      <div style={{ padding: 16 }}>
        <div className="card">
        <h2>Visualisasi Ringkasan Data</h2>
        <p style={{ marginTop: 0, color: 'var(--muted)' }}>Chart menunjukkan distribusi status dan total harga per kabupaten (dalam juta).</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <section aria-label="Distribusi status" className="card">
            <h3>Jumlah Unit per Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                  {byStatus.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section aria-label="Total harga per kabupaten" className="card">
            <h3>Total Harga per Kabupaten (juta)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceByKab} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(v) => `${v} Jt`} />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => navigate('/')} >Kembali ke Tabel</button>
        </div>
        </div>
      </div>
    </div>
  )
}
