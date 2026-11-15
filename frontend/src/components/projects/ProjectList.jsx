import ProjectCard from './ProjectCard';
import EmptyState from '../common/EmptyState';
export default function ProjectList({ projects = [] }) { return projects.length ? <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="No projects found" description="Create a project or ask a project manager to add you to one." />; }
