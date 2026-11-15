import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardApi from '../../api/dashboardApi';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import reportApi from '../../api/reportApi';
const TaskStatusChart = lazy(() => import('../../components/charts/TaskStatusChart'));
const ProjectProgressChart = lazy(() => import('../../components/charts/ProjectProgressChart'));

const emptyOverview = { totalProjects: 0, totalTasks: 0, completedTasks: 0, overdueTasks: 0, activeMembers: 0, recentActivity: [], recentProjects: [], recentTasks: [] };
function DashboardPage() {
  const [overview, setOverview] = useState(emptyOverview); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    dashboardApi.getOverview().then(setOverview).catch(() => setError('Dashboard data could not be loaded. Please try again.')).finally(() => setLoading(false));
    reportApi.getReports().then(setAnalytics).catch(() => {});
  }, []);
  const firstName = (user?.fullName || 'there').split(' ')[0];
  const canCreateProject = ['ADMIN', 'PROJECT_MANAGER'].includes(user?.role);
  const projectCounts = analytics?.projectStatusCounts || {};
  const cards = [['Total projects', overview.totalProjects, 'Projects you can access'], ['Active projects', analytics?.activeProjects ?? '—', 'Currently in progress'], ['Completed projects', projectCounts.COMPLETED ?? '—', 'Successfully delivered'], ['Total tasks', overview.totalTasks, 'Across your workspace'], ['Completed tasks', overview.completedTasks, 'Successfully finished'], ['Overdue tasks', overview.overdueTasks, 'Past their due date']];
  return <div className="page-block dashboard-page">
    <section className="welcome-panel"><div><p className="eyebrow">Workspace overview</p><h2>Good day, {firstName}</h2><p>Here is what is happening across your workspace.</p></div><div className="welcome-actions"><span>{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</span>{canCreateProject && <Link className="primary-button" to="/projects/create">Create project</Link>}<Link className="secondary-button" to="/tasks">View tasks</Link></div></section>
    {error && <p role="alert" className="error-box">{error}</p>}
    {loading ? <div className="stats-grid">{cards.map(([label]) => <div className="stat-card skeleton-card" key={label}><span>{label}</span><strong>—</strong></div>)}</div> : error ? null : <>
      <div className="stats-grid">{cards.map(([label, value, hint], index) => <article className="stat-card" key={label}><div className="stat-card-top"><span>{label}</span><span className={`stat-marker marker-${index}`} aria-hidden="true" /></div><strong>{value ?? 0}</strong><small>{hint}</small></article>)}</div>
      {analytics && <Suspense fallback={<p>Loading charts…</p>}><div className="report-chart-grid dashboard-charts"><section className="panel"><div className="section-heading"><h3>Task distribution</h3><Link to="/reports">View reports</Link></div><TaskStatusChart data={analytics.taskStatusCounts || {}} /></section><section className="panel"><div className="section-heading"><h3>Projects by status</h3><Link to="/reports">View reports</Link></div><ProjectProgressChart data={analytics.projectStatusCounts || {}} /></section></div></Suspense>}
      <div className="dashboard-grid"><section className="panel dashboard-section"><div className="section-heading"><div><p className="eyebrow">Your portfolio</p><h3>Recent projects</h3></div><Link to="/projects">All projects</Link></div>{overview.recentProjects?.length ? <div className="dashboard-project-list">{overview.recentProjects.map((project) => <Link className="dashboard-project" to={`/projects/${project.id}`} key={project.id}><span className="project-monogram">{project.name?.slice(0, 1)?.toUpperCase() || 'P'}</span><span className="dashboard-item-copy"><strong>{project.name}</strong><small>{project.description || 'No description provided'}</small></span><span className="project-state">{project.status?.replaceAll('_', ' ').toLowerCase()}</span><span className="project-date">{formatDate(project.dueDate)}</span></Link>)}</div> : <div className="dashboard-empty"><strong>No projects yet</strong><span>Create a project to start organizing work.</span></div>}</section>
        <section className="panel dashboard-section"><div className="section-heading"><div><p className="eyebrow">Work in motion</p><h3>Recent tasks</h3></div><Link to="/tasks">All tasks</Link></div>{overview.recentTasks?.length ? <div className="dashboard-task-list">{overview.recentTasks.slice(0, 6).map((task) => <Link className="dashboard-task" to={`/tasks/${task.id}`} key={task.id}><span className={`task-priority-dot priority-${task.priority?.toLowerCase()}`} /><span className="dashboard-item-copy"><strong>{task.title}</strong><small>{task.projectName || 'Project'} · {task.assignedToName || 'Unassigned'}</small></span><span className="task-state">{task.status?.replaceAll('_', ' ').toLowerCase()}</span><time>{formatDate(task.dueDate)}</time></Link>)}</div> : <div className="dashboard-empty"><strong>No tasks to show</strong><span>Your latest work will appear here.</span></div>}</section>
        <section className="panel dashboard-section activity-section"><div className="section-heading"><div><p className="eyebrow">Latest updates</p><h3>Recent activity</h3></div></div>{overview.recentActivity?.length ? <div className="activity-list">{overview.recentActivity.slice(0, 6).map((activity) => <article className="activity-row" key={activity.id}><span className="activity-avatar">{activity.userName?.slice(0, 1)?.toUpperCase() || 'T'}</span><span className="dashboard-item-copy"><strong>{activity.description}</strong><small>{activity.userName || 'Team member'}</small></span><time>{formatDateTime(activity.createdAt)}</time></article>)}</div> : <div className="dashboard-empty"><strong>No recent activity</strong><span>Updates will appear here as work progresses.</span></div>}</section>
      </div>
    </>}
  </div>;
}
export default DashboardPage;
