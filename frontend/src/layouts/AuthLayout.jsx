function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">{children}</div>
    </div>
  );
}

export default AuthLayout;
