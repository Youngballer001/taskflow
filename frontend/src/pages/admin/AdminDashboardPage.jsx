import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../../api/userApi';

function AdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => { userApi.getUsers({ page: 0, size: 1 }).then((page) => setTotalUsers(page.totalElements)).catch(() => setError('Administrative statistics could not be loaded.')); }, []);
  return <div className="page-block"><header className="page-header"><h2>Admin dashboard</h2></header>{error && <p role="alert" className="error-box">{error}</p>}<div className="stats-grid"><article className="stat-card"><span>Registered users</span><strong>{totalUsers}</strong></article></div><div className="panel"><h3>Account administration</h3><p>Search users, update roles, and activate or deactivate accounts.</p><Link to="/admin/users" className="primary-button">Manage users</Link></div></div>;
}

export default AdminDashboardPage;
