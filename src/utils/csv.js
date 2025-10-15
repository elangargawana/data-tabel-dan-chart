export function toCSV(rows, columns) {
  const header = columns.map(c => c.label)
  const keys = columns.map(c => c.key)
  const lines = [header.join(',')]
  for (const r of rows) {
    const vals = keys.map(k => {
      const v = r[k]
      if (v == null) return ''
      const s = typeof v === 'number' ? v : String(v).replace(/"/g, '""')
      return `"${s}"`
    })
    lines.push(vals.join(','))
  }
  return lines.join('\n')
}
