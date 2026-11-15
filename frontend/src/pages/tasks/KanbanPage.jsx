import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { useAuth } from '../../context/AuthContext';

function KanbanPage() {
  const [tasks, setTasks] = useState([]); const [error, setError] = useState(''); const [savingTask, setSavingTask] = useState(null);
  const { user } = useAuth(); const canCreate = ['ADMIN', 'PROJECT_MANAGER'].includes(user?.role);
  const load = () => taskApi.getTasks().then(setTasks).catch(() => setError('Tasks could not be loaded. Please try again.'));
  useEffect(() => { load(); }, []);
  const moveTask = async (taskId, status) => {
    const previous = tasks; setError(''); setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task)); setSavingTask(taskId);
    try { const updated = await taskApi.updateTaskStatus(taskId, status); setTasks((current) => current.map((task) => task.id === taskId ? updated : task)); }
    catch { setTasks(previous); setError('The status change could not be saved. The task was restored to its previous column.'); }
    finally { setSavingTask(null); }
  };
  return <div className="page-block"><header className="page-header"><div><p className="eyebrow">Workflow</p><h2>Kanban board</h2><p>Move a task to update its status.</p></div>{canCreate && <Link className="primary-button" to="/tasks">Create task</Link>}</header>{error && <p role="alert" className="error-box">{error}</p>}<KanbanBoard tasks={tasks} onMove={moveTask} savingTaskId={savingTask} /></div>;
}
export default KanbanPage;
