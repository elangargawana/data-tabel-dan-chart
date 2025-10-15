import React from 'react'
/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import DataTable from './DataTable'

const columns = [{ key: 'kode', label: 'Kode' }, { key: 'nama', label: 'Nama' }]
const data = [ { id:1, kode: 'U-00001', nama: 'A' }, { id:2, kode: 'U-00002', nama: 'B' } ]

test('renders rows and activates on Enter', () => {
  const mock = vi.fn()
  render(<DataTable columns={columns} data={data} height={120} rowHeight={48} onRowClick={mock} />)
  // the first rendered row is the header, so the first data row is index 1
  const rows = screen.getAllByRole('row')
  const firstDataRow = rows.find((r, idx) => idx > 0)
  firstDataRow.focus()
  fireEvent.keyDown(firstDataRow, { key: 'Enter' })
  expect(mock).toHaveBeenCalled()
})
