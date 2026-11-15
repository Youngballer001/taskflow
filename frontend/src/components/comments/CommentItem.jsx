import { useState } from 'react';
import { formatDateTime } from '../../utils/formatters';
export default function CommentItem({ comment, canDelete, canEdit, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState('');
  const save = async () => { try { setError(''); await onEdit(comment.id, content); setEditing(false); } catch { setError('Comment could not be saved.'); } };
  return <article className="comment-item"><header><strong>{comment.authorName || 'Member'}</strong><time>{formatDateTime(comment.createdAt)}</time></header>{editing ? <><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} />{error && <p role="alert">{error}</p>}<button type="button" onClick={save}>Save</button><button type="button" onClick={() => { setEditing(false); setContent(comment.content); }}>Cancel</button></> : <p>{comment.content}</p>}{canEdit && !editing && <button type="button" onClick={() => setEditing(true)}>Edit</button>}{canDelete && <button type="button" onClick={() => onDelete(comment.id)}>Delete</button>}</article>;
}
