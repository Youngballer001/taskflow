import { useEffect, useState } from 'react';
import projectApi from '../../api/projectApi';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', dueDate: '' });

  const fetchProjects = async () => {
    const data = await projectApi.getProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await projectApi.createProject(form);
    setProjects((current) => [created, ...current]);
    setForm({ name: '', description: '', dueDate: '' });
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>Projects</h2>
        </div>
      </div>

      <div className="two-column-layout">
        <form className="stack-form panel" onSubmit={handleSubmit}>
          <h3>Create project</h3>
          <label>
            Project name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
          </label>
          <label>
            Due date
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          </label>
          <button type="submit" className="primary-button">Create project</button>
        </form>

        <div className="panel project-list-panel">
          <h3>All projects</h3>
          <div className="list-stack">
            {projects.map((project) => (
              <div key={project.id} className="list-item-card">
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.description || 'No description added yet.'}</p>
                </div>
                <div className="meta-row">
                  <span className="pill medium">{project.status || 'PLANNING'}</span>
                  <small>{project.dueDate || 'No due date'}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
