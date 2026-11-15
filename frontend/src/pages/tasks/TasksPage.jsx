import { useEffect, useState } from 'react';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';

const defaultTaskForm = {
  title: '',
  description: '',
  projectId: '',
  priority: 'MEDIUM',
  status: 'TODO',
};

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(defaultTaskForm);

  const fetchTasks = async () => {
    const data = await taskApi.getTasks();
    setTasks(data);
  };

  useEffect(() => {
    Promise.all([fetchTasks(), projectApi.getProjects()]).then(([, projectList]) => setProjects(projectList)).catch(() => setError('Tasks or projects could not be loaded.'));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const created = await taskApi.createTask({ ...form, projectId: Number(form.projectId) });
      setTasks((current) => [created, ...current]);
      setForm({ ...defaultTaskForm, projectId: projects[0]?.id || '' });
    } catch {
      setError('Task could not be created. Check the project and your permissions.');
    }
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
          {error && <p role="alert" className="error-box">{error}</p>}
          <label>
            Project
            <select name="projectId" value={form.projectId} onChange={handleChange} required>
              <option value="">Choose a project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
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
              <option value="COMPLETED">Completed</option>
              <option value="IN_REVIEW">In review</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <button type="submit" className="primary-button" disabled={!projects.length}>Create task</button>
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
