import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
