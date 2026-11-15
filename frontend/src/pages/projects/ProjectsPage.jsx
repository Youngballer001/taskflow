import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useProjects from '../../hooks/useProjects';
import ProjectList from '../../components/projects/ProjectList';
import { useAuth } from '../../context/AuthContext';

function ProjectsPage() {
  const { projects, loading, error } = useProjects();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const visibleProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.description || ''}`.toLowerCase().includes(search.toLowerCase())), [projects, search]);
  const canCreate = Boolean(user);
  return <div className="page-block"><header className="page-header"><div><p className="eyebrow">Portfolio</p><h2>Projects</h2></div>{canCreate && <Link className="primary-button" to="/projects/create">Create project</Link>}</header><div className="filters-row"><input type="search" aria-label="Search projects" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} /></div>{error && <p role="alert" className="error-box">{error}</p>}{loading ? <p>Loading projects…</p> : <ProjectList projects={visibleProjects} />}</div>;
}
export default ProjectsPage;
