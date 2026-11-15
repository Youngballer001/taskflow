import { useState } from 'react';
export default function PasswordInput({ label = 'Password', id = 'password', ...props }) {
  const [visible, setVisible] = useState(false);
  return <label className="password-field" htmlFor={id}><span>{label}</span><span className="password-input-wrap"><input id={id} type={visible ? 'text' : 'password'} {...props} /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? 'Hide' : 'Show'}</button></span></label>;
}
