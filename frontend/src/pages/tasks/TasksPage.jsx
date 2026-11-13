import { useEffect, useState } from 'react';
import taskApi from '../../api/taskApi';

const defaultTaskForm = {
  title: '',
  description: '',
  projectId: 1,
  priority: 'MEDIUM',
  status: 'TODO',
};

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(defaultTaskForm);

  const fetchTasks = async () => {
    const data = await taskApi.getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await taskApi.createTask(form);
    setTasks((current) => [created, ...current]);
    setForm(defaultTaskForm);
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Execution</p>
          <h2>Tasks</h2>
        </div>
      </div>

      <div className="two-column-layout">
        <form className="stack-form panel" onSubmit={handleSubmit}>
          <h3>Add task</h3>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
          </label>
          <label>
            Project ID
            <input name="projectId" type="number" value={form.projectId} onChange={handleChange} />
          </label>
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
          </label>
          <button type="submit" className="primary-button">Create task</button>
        </form>

        <div className="panel project-list-panel">
          <h3>Current workload</h3>
          <div className="list-stack">
            {tasks.map((task) => (
              <div key={task.id} className="list-item-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description || 'No description available.'}</p>
                </div>
                <div className="meta-row">
                  <span className="pill medium">{task.status}</span>
                  <small>{task.priority}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
