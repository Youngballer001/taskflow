import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../../components/projects/ProjectForm';
import projectApi from '../../api/projectApi';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { projectApi.getProjectById(id).then(setProject).catch(() => setError('Project could not be loaded.')); }, [id]);
  const submit = async (payload) => { try { await projectApi.updateProject(id, payload); navigate(`/projects/${id}`); } catch { setError('Project could not be updated. Check your permissions.'); } };
  return <div className="page-block"><header className="page-header"><h2>Edit project</h2><Link to={`/projects/${id}`}>Cancel</Link></header>{error && <p role="alert" className="error-box">{error}</p>}{project && <ProjectForm key={project.id} initialValue={project} onSubmit={submit} submitLabel="Save changes" />}</div>;
}
