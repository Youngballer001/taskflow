export default function ErrorMessage({ children, message, role = 'alert' }) {
  const text = message || children;
  return text ? <p role={role} className="error-box">{text}</p> : null;
}
