import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import { useNotifications } from '../../context/NotificationContext';
import Icon from '../common/Icon';

const titles = { '/dashboard': 'Overview', '/projects': 'Projects', '/tasks': 'My tasks', '/kanban': 'Kanban board', '/team': 'Team', '/reports': 'Reports & analytics', '/notifications': 'Notifications', '/profile': 'Profile', '/settings': 'Settings', '/admin': 'Admin dashboard', '/admin/users': 'User management' };
export default function Navbar({ onMenu }) {
  const location = useLocation(); const navigate = useNavigate();
  const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const { unreadCount } = useNotifications();
  const title = titles[location.pathname] || (location.pathname.startsWith('/projects/') ? 'Project overview' : location.pathname.startsWith('/tasks/') ? 'Task details' : 'TaskFlow');
  const signOut = async () => { await logout(); navigate('/login'); };
  return <header className="topbar"><div className="topbar-heading"><button type="button" className="mobile-menu-button" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" /></button><div><span className="breadcrumb">Workspace <span>/</span> {title}</span><h1>{title}</h1></div></div><div className="topbar-actions"><button type="button" className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title="Toggle theme"><Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} /></button><NotificationBell unreadCount={unreadCount} /><details className="user-menu"><summary className="topbar-user"><div className="avatar">{(user?.fullName || 'U').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="topbar-user-copy"><strong>{user?.fullName || 'My profile'}</strong><small>{user?.role?.replaceAll('_', ' ').toLowerCase() || 'Member'}</small></div><Icon name="chevron-down" size={14} /></summary><div className="user-dropdown"><Link to="/profile">Profile</Link><Link to="/settings">Settings</Link><button type="button" onClick={signOut}>Sign out</button></div></details></div></header>;
}
