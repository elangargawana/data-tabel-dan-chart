import React, { useMemo, useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import "./table.css";

/*
  Reusable DataTable props:
  - columns: [{ key, label, width? }]
  - data: array of objects
  - rowHeight: number
  - height: number (px)
  - onRowClick?: callback
  Accessibility: keyboard nav via tab, aria attributes on table
*/

export default function DataTable({ columns, data, rowHeight = 48, height = 400, onRowClick, sortable = true, sortState, onSortChange }) {
  // compute a desktop table width from column widths (fallback to 160px per column)
  const totalWidth = columns.reduce((s, c) => s + (typeof c.width === "number" ? c.width : 160), 0);
  // detect small screens so we can render non-virtualized, flexible-height rows
  const [isMobile, setIsMobile] = React.useState(typeof window !== "undefined" ? window.innerWidth <= 640 : false);
  React.useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 640);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const Row = useCallback(
    ({ index, style }) => {
      const row = data[index];
      return (
        <div
          className={`tr ${index % 2 === 0 ? "even" : "odd"}`}
          role="row"
          style={style}
          tabIndex={0}
          onClick={() => onRowClick && onRowClick(row)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRowClick && onRowClick(row);
          }}
        >
          {columns.map((col) => (
            <div key={col.key} className="td" role="cell" style={{ width: col.width || "auto" }} data-label={col.label}>
              {col.render ? col.render(row[col.key], row) : row[col.key]}
            </div>
          ))}
        </div>
      );
    },
    [columns, data, onRowClick]
  );

  const header = (
    <div className="thead" role="rowgroup">
      <div className="tr header" role="row">
        {columns.map((col) => {
          const isSortable = sortable && col.sortable !== false;
          const active = sortState && sortState.key === col.key;
          const dir = active ? sortState.direction : null;
          return (
            <div key={col.key} className={`th ${isSortable ? "sortable" : ""}`} role="columnheader" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} style={{ width: col.width || "auto" }}>
              {isSortable ? (
                <button
                  onClick={() => {
                    if (!onSortChange) return;
                    let next = { key: col.key, direction: "asc" };
                    if (active && dir === "asc") next.direction = "desc";
                    else if (active && dir === "desc") next = null;
                    onSortChange(next);
                  }}
                  className="sort-btn"
                  aria-label={`Sort by ${col.label}`}
                >
                  <span>{col.label}</span>
                  <span className="sort-indicator">{active ? (dir === "asc" ? "▲" : "▼") : "↕"}</span>
                </button>
              ) : (
                col.label
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="table-outer">
      <div className="table" role="table" aria-rowcount={data.length} style={{ minWidth: totalWidth }}>
        {header}
        <div className="tbody" role="rowgroup">
          {isMobile ? (
            // render normal rows (variable height) on mobile for readability
            data.map((_, idx) => <Row key={idx} index={idx} style={{}} />)
          ) : (
            <List height={height} itemCount={data.length} itemSize={rowHeight} width={totalWidth}>
              {Row}
            </List>
          )}
        </div>
      </div>
    </div>
  );
}
