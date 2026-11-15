import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { isStrongPassword } from '../../utils/validators';
import PasswordInput from '../../components/common/PasswordInput';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!isStrongPassword(form.password)) { setError('Use at least 8 characters with a letter and a number.'); return; }
    setLoading(true);
    try { await register(form); navigate('/dashboard'); }
    catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (message) setError(message);
      else if (status === 409) setError('An account with this email already exists.');
      else if (status === 400 || status === 422) setError('Check the registration details and try again.');
      else if (status === 503) setError('The registration service is temporarily unavailable. Please try again.');
      else setError('Account creation failed. Please try again later.');
    }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-form-container">
      <h2>Create account</h2>
      <p>Start managing projects and tasks in one place.</p>

      {error && <p role="alert" className="error-box">{error}</p>}
      <form onSubmit={handleSubmit} className="stack-form">
        <label>
          Full name
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <PasswordInput name="password" value={form.password} onChange={handleChange} minLength={8} required autoComplete="new-password" />
        <PasswordInput label="Confirm password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
        <button type="submit" className="primary-button" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>

      <div className="auth-links">
        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
