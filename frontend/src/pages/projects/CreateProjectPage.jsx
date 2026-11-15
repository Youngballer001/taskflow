import { Link, useNavigate } from 'react-router-dom';
import ProjectForm from '../../components/projects/ProjectForm';
import projectApi from '../../api/projectApi';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const submit = async (form) => { const project = await projectApi.createProject(form); navigate(`/projects/${project.id}`); };
  return <div className="page-block"><header className="page-header"><h2>Create project</h2><Link to="/projects">Back</Link></header><ProjectForm onSubmit={submit} submitLabel="Create project" /></div>;
}
