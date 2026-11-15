import { useState } from 'react';
import Button from '../common/Button';
export default function CommentForm({ onSubmit, submitting = false }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => { event.preventDefault(); if (!content.trim()) return; try { setError(''); await onSubmit(content.trim()); setContent(''); } catch { setError('Comment could not be posted. Please try again.'); } };
  return <form className="comment-form" onSubmit={submit}><label htmlFor="comment-content">Add a comment</label><textarea id="comment-content" value={content} onChange={(event) => setContent(event.target.value)} required maxLength={5000} rows={3} />{error && <p role="alert" className="error-box">{error}</p>}<Button type="submit" disabled={submitting || !content.trim()}>{submitting ? 'Posting...' : 'Post comment'}</Button></form>;
}
