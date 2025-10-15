# Components

This folder contains reusable components used in the sample app.

- DataTable.jsx: Virtualized, accessible table component. Props: columns, data, rowHeight, height, onRowClick, sortable, sortState, onSortChange. Supports column sorting and keyboard activation. Uses react-window for virtualization.
- Filters.jsx: Simple search and select filters.
- Pagination.jsx: Lightweight client-side pagination control.

Usage example (in a page):

1. Define columns: const columns = [{ key: 'kode', label: 'Kode Unit' }, ...]
2. Provide data: array of objects with matching keys.
3. Render: <DataTable columns={columns} data={data} height={400} />

Notes:
- For large data sets the DataTable is virtualized; for client-side pagination slice the data and pass only the current page to the table.
- Column rendering can be customized via a `render` function on the column definition.
- Sorting is controlled from the parent via `sortState` and `onSortChange` so the parent can sort/filter/paginate the data set deterministically.
