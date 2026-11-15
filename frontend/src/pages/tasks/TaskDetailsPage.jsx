import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import commentApi from '../../api/commentApi';
import { useAuth } from '../../context/AuthContext';
import TaskDetails from '../../components/tasks/TaskDetails';
import CommentForm from '../../components/comments/CommentForm';
import CommentList from '../../components/comments/CommentList';

function TaskDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const [taskData, commentData] = await Promise.all([taskApi.getTask(id), commentApi.getComments(id)]);
      setTask(taskData); setComments(commentData); setError('');
    } catch { setError('Task details could not be loaded. Verify that you belong to its project.'); }
  }, [id]);
  useEffect(() => { load(); }, [load]);
  const addComment = async (content) => { try { const comment = await commentApi.createComment(id, { content }); setComments((current) => [comment, ...current]); } catch { setError('Comment could not be posted.'); throw new Error('Comment request failed'); } };
  const editComment = async (commentId, content) => { const updated = await commentApi.updateComment(id, commentId, { content }); setComments((current) => current.map((item) => item.id === commentId ? updated : item)); };
  const removeComment = async (commentId) => { if (!window.confirm('Delete this comment?')) return; try { await commentApi.deleteComment(id, commentId); setComments((current) => current.filter((item) => item.id !== commentId)); } catch { setError('Comment could not be deleted.'); } };
  return <div className="page-block"><div className="page-header"><Link to="/tasks">← Tasks</Link></div>{error && <p role="alert" className="error-box">{error}</p>}{task && <><section className="panel"><TaskDetails task={task} /></section><section className="panel"><h3>Discussion</h3><CommentForm onSubmit={addComment} /><CommentList comments={comments} canDelete={(comment) => comment.userId === user?.id || task.projectOwnerId === user?.id} canEdit={(comment) => comment.userId === user?.id} onDelete={removeComment} onEdit={editComment} /></section></>}</div>;
}
export default TaskDetailsPage;
