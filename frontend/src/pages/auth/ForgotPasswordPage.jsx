import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  return (
    <div className="auth-form-container">
      <h2>Reset password</h2>
      <p>Password reset is not available because TaskFlow has no configured email delivery service. Contact your administrator to reset your account.</p>
      <Link to="/login">Back to login</Link>
    </div>
  );
}

export default ForgotPasswordPage;
