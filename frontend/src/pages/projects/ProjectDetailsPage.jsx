import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import taskApi from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import TaskList from '../../components/tasks/TaskList';
import ProjectMembers from '../../components/projects/ProjectMembers';
import ProjectStatusBadge from '../../components/projects/ProjectStatusBadge';

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([projectApi.getProjectById(id), projectApi.getProjectMembers(id), taskApi.getTasksForProject(id)])
      .then(([projectData, memberData, taskData]) => { setProject(projectData); setMembers(memberData); setTasks(taskData); })
      .catch(() => setError('Project data could not be loaded. You may not have access to this project.'));
  }, [id]);
  const canManage = project && (project.ownerId === user?.id || user?.role === 'ADMIN');
  const removeProject = async () => { if (!window.confirm(`Delete ${project.name} and its tasks?`)) return; try { await projectApi.deleteProject(id); navigate('/projects'); } catch { setError('Project could not be deleted.'); } };
  return <div className="page-block"><header className="page-header"><div><Link to="/projects">Projects</Link><h2>{project?.name || 'Project details'}</h2></div>{canManage && <div className="page-header-actions"><Link className="secondary-button" to={`/projects/${id}/edit`}>Edit project</Link><button type="button" onClick={removeProject}>Delete</button></div>}</header>{error && <p role="alert" className="error-box">{error}</p>}{project && <><section className="panel project-summary"><p>{project.description || 'No description provided.'}</p><p>Owner: {project.ownerName}</p><p>Dates: {project.startDate || 'Not set'} — {project.dueDate || 'No deadline'}</p><ProjectStatusBadge status={project.status} /><p>{tasks.filter((task) => task.status === 'COMPLETED').length} of {tasks.length} tasks completed</p></section><section className="panel"><header className="section-heading"><h3>Project members</h3><Link to="/team">Manage team</Link></header><ProjectMembers members={members} canManage={canManage} onRemove={async (memberId) => { try { await projectApi.removeProjectMember(id, memberId); setMembers((current) => current.filter((member) => member.userId !== memberId)); } catch { setError('Member could not be removed.'); } }} /></section><section className="panel"><header className="section-heading"><h3>Tasks</h3>{canManage && <Link to="/tasks">Create tasks</Link>}</header><TaskList tasks={tasks} /></section></>}</div>;
}
export default ProjectDetailsPage;
