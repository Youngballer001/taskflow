import { useState } from 'react';
import Button from '../common/Button';
import { PROJECT_STATUSES } from '../../utils/constants';
export default function ProjectForm({ initialValue = {}, onSubmit, submitLabel = 'Save project' }) {
  const [form, setForm] = useState({ name: initialValue.name || '', description: initialValue.description || '', startDate: initialValue.startDate || '', dueDate: initialValue.dueDate || '', status: initialValue.status || 'PLANNING' });
  const [error, setError] = useState('');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); setError(''); if (form.startDate && form.dueDate && form.dueDate < form.startDate) { setError('Due date must be on or after the start date.'); return; } try { await onSubmit(form); } catch { setError('Project could not be saved. Check your access and try again.'); } };
  return <form className="stack-form panel" onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={update} minLength={2} maxLength={255} required /></label><label>Description<textarea name="description" value={form.description} onChange={update} rows={4} /></label><label>Start date<input type="date" name="startDate" value={form.startDate} onChange={update} /></label><label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>{initialValue.id && <label>Status<select name="status" value={form.status} onChange={update}>{PROJECT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>}{error && <p role="alert" className="error-box">{error}</p>}<Button type="submit">{submitLabel}</Button></form>;
}
