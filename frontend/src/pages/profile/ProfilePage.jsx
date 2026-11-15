import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import userApi from '../../api/userApi';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const saveProfile = async (event) => { event.preventDefault(); try { const updated = await userApi.updateProfile(profile); updateUser(updated); setMessage('Profile updated.'); setError(''); } catch { setError('Profile could not be updated.'); } };
  const savePassword = async (event) => { event.preventDefault(); if (password.newPassword !== password.confirmPassword) { setError('Password confirmation does not match.'); return; } try { await userApi.changePassword(password); setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage('Password changed.'); setError(''); } catch { setError('Password could not be changed. Check your current password.'); } };

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Profile</h2>
      </div>
      {message && <p role="status">{message}</p>}{error && <p role="alert" className="error-box">{error}</p>}
      <form className="panel stack-form" onSubmit={saveProfile}><h3>Profile information</h3><label>Full name<input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required minLength={2} maxLength={255} /></label><label>Email<input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required /></label><p>Role: {user?.role}</p><button className="primary-button">Save profile</button></form>
      <form className="panel stack-form" onSubmit={savePassword}><h3>Change password</h3><label>Current password<input type="password" autoComplete="current-password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} required /></label><label>New password<input type="password" autoComplete="new-password" minLength={8} value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} required /></label><label>Confirm password<input type="password" autoComplete="new-password" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} required /></label><button className="primary-button">Change password</button></form>
    </div>
  );
}

export default ProfilePage;
