import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/common/PasswordInput';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to sign in right now. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome back</h2>
      <p>Sign in to your TaskFlow workspace.</p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="stack-form">
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <PasswordInput name="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
        <button type="submit" className="primary-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>

      <div className="auth-links">
        <Link to="/register">Create an account</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
}

export default LoginPage;
