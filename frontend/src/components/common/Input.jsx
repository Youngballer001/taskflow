export default function Input({ label, id, error, ...props }) {
  const inputId = id || props.name;
  return <label className="form-field" htmlFor={inputId}>{label && <span>{label}</span>}<input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />{error && <small id={`${inputId}-error`} className="field-error">{error}</small>}</label>;
}
