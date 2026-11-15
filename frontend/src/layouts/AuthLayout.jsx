function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card"><div className="auth-brand"><span className="brand-mark">T</span><strong>TaskFlow</strong></div>{children}</div>
    </div>
  );
}

export default AuthLayout;
