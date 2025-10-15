// Lightweight mock data generator for units
const statuses = ['Available', 'Sold', 'Reserved']
const kabupatens = ['Semarang', 'Solo', 'Sukoharjo', 'Magelang', 'Pekalongan', 'Purbalingga']

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateUnits(count = 5000) {
  const units = []
  for (let i = 1; i <= count; i++) {
    const kode = `U-${String(i).padStart(5, '0')}`
    const nama = `Perumahan Cendana ${rnd(1, 20)}`
    const kab = kabupatens[rnd(0, kabupatens.length - 1)]
    const status = statuses[rnd(0, statuses.length - 1)]
    const harga = rnd(200000000, 2000000000)
    units.push({ id: i, kode, nama, kabupaten: kab, status, harga })
  }
  return units
}

export const sampleUnits = generateUnits(250)
