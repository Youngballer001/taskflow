import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  return (
    <div className="auth-form-container">
      <h2>Reset password</h2>
      <p>Password reset workflows can be connected to your auth provider here.</p>
      <Link to="/login">Back to login</Link>
    </div>
  );
}

export default ForgotPasswordPage;
