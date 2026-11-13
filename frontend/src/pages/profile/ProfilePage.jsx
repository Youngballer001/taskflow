import { useAuth } from '../../context/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Profile</h2>
      </div>
      <div className="panel">
        <h3>{user?.fullName || 'Demo User'}</h3>
        <p>{user?.email || 'demo@taskflow.app'}</p>
        <p>Role: {user?.role || 'ADMIN'}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
