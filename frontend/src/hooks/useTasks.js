import { useCallback, useEffect, useState } from 'react';
import taskApi from '../api/taskApi';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setLoading(true);
    try { setTasks(await taskApi.getTasks()); setError(''); }
    catch { setError('Tasks could not be loaded.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  const create = async (request) => { const task = await taskApi.createTask(request); setTasks((current) => [task, ...current]); return task; };
  const updateStatus = async (id, status) => { const task = await taskApi.updateTaskStatus(id, status); setTasks((current) => current.map((item) => item.id === id ? task : item)); return task; };
  return { tasks, setTasks, loading, error, reload, create, updateStatus };
}
