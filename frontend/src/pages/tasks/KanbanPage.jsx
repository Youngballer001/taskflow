import { useEffect, useState } from 'react';
import taskApi from '../../api/taskApi';

function KanbanPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await taskApi.getTasks();
      setTasks(data);
    };

    load();
  }, []);

  const columns = {
    TODO: tasks.filter((task) => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter((task) => task.status === 'DONE'),
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Kanban board</h2>
      </div>
      <div className="kanban-grid">
        {Object.entries(columns).map(([column, items]) => (
          <div key={column} className="panel">
            <h3>{column.replace('_', ' ')}</h3>
            {items.map((task) => (
              <div key={task.id} className="list-item-card">
                <strong>{task.title}</strong>
                <small>{task.priority}</small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanPage;

