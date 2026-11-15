import { Link } from 'react-router-dom';
import { formatDate, formatStatus } from '../../utils/formatters';
export default function ProjectCard({ project }) { return <article className="project-card"><header><h3><Link to={`/projects/${project.id}`}>{project.name}</Link></h3><span className={`status-badge status-${String(project.status || '').toLowerCase()}`}>{formatStatus(project.status)}</span></header><p>{project.description || 'No description provided.'}</p><footer><span>Owner: {project.ownerName || 'You'}</span><time>Due {formatDate(project.dueDate)}</time></footer></article>; }
