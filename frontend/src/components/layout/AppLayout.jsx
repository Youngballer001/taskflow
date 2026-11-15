import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} onClose={() => setMobileOpen(false)} /><div className="main-panel"><Navbar onMenu={() => setMobileOpen(true)} /><main className="page-container">{children}</main></div></div>;
}
