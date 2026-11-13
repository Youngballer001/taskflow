import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate('/dashboard');
  };

  return (
    <div className="auth-form-container">
      <h2>Create account</h2>
      <p>Start managing projects and tasks in one place.</p>

      <form onSubmit={handleSubmit} className="stack-form">
        <label>
          Full name
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirm password
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </label>
        <button type="submit" className="primary-button">Create account</button>
      </form>

      <div className="auth-links">
        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
