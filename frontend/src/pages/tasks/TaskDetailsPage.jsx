import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = (await taskApi.getTasks()).find((item) => item.id === Number(id));
      setTask(data);
    };

    load();
  }, [id]);

  if (!task) {
    return <div className="empty-state">Loading task…</div>;
  }

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>{task.title}</h2>
      </div>
      <div className="panel">
        <p>{task.description}</p>
        <p>Status: {task.status}</p>
        <p>Priority: {task.priority}</p>
      </div>
    </div>
  );
}

export default TaskDetailsPage;

