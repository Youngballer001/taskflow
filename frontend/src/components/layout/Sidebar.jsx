import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';

const sections = [
  { title: 'Workspace', items: [['/dashboard', 'Overview', 'overview'], ['/tasks', 'My tasks', 'tasks'], ['/projects', 'Projects', 'projects'], ['/kanban', 'Kanban board', 'kanban'], ['/team', 'Team', 'team']] },
  { title: 'Insights', items: [['/reports', 'Reports & analytics', 'reports']] },
  { title: 'Personal', items: [['/notifications', 'Notifications', 'notifications'], ['/profile', 'Profile', 'profile'], ['/settings', 'Settings', 'settings']] },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const admin = user?.role === 'ADMIN';
  const signOut = async () => { await logout(); navigate('/login'); };
  return <>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <div className="brand-block"><div className="brand-mark">T</div><div className="brand-copy"><strong>TaskFlow</strong><small>Workspace</small></div><button className="sidebar-collapse" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><Icon name="chevron" size={15} /></button></div>
      <nav className="sidebar-nav" aria-label="Main navigation">{sections.map((section) => <div className="nav-section" key={section.title}><span className="nav-section-title">{section.title}</span>{section.items.map(([to, label, icon]) => <NavLink key={to} to={to} title={collapsed ? label : undefined} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><span className="nav-icon"><Icon name={icon} size={17} /></span><span className="nav-label">{label}</span></NavLink>)}</div>)}{admin && <div className="nav-section"><span className="nav-section-title">Administration</span><NavLink to="/admin" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><span className="nav-icon"><Icon name="admin" size={17} /></span><span className="nav-label">Admin dashboard</span></NavLink><NavLink to="/admin/users" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><span className="nav-icon"><Icon name="users" size={17} /></span><span className="nav-label">User management</span></NavLink></div>}</nav>
      <div className="sidebar-user"><div className="avatar">{(user?.fullName || 'U').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="sidebar-user-copy"><strong>{user?.fullName || 'Your account'}</strong><small>{user?.role?.replaceAll('_', ' ').toLowerCase() || 'Member'}</small></div><button className="sidebar-logout" onClick={signOut} title="Sign out" aria-label="Sign out"><Icon name="logout" size={16} /></button></div>
    </aside>
  </>;
}
