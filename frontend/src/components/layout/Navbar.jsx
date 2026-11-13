import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div>
        <h1>TaskFlow</h1>
      </div>
      <div className="topbar-actions">
        <Link to="/profile" className="ghost-link">
          {user?.fullName || 'Demo User'}
        </Link>
        <button type="button" className="primary-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
