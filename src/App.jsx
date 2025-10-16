import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DataPage from "./pages/DataPage";
import ChartPage from "./pages/ChartPage";
import DataCardGrid from "./components/DataCardGrid";
import DataPageGrid from "./pages/DataPageGrid";
import DetailPage from "./pages/DetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-topbar headbar">
          <div className="page-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="2" y="4" width="20" height="16" rx="4" fill="#ffffff" opacity="0.06" />
                <path d="M6 8h12v8H6z" fill="#4f46e5" />
                <circle cx="9" cy="12" r="1.6" fill="#fff" />
                <circle cx="15" cy="12" r="1.6" fill="#fff" />
              </svg>
              <div className="brand-left">React Data Table & Chart</div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<DataPageGrid />} />
              <Route path="/detail/:kode" element={<DetailPage />} />
              <Route path="/chart" element={<ChartPage />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="page-wrapper" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <div style={{ color: "#475569" }}>© {new Date().getFullYear()} React Data Table</div>
            <div style={{ color: "#64748b" }}>Built with React • Vite</div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
