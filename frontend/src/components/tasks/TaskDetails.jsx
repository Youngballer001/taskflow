import { formatDate, formatDateTime } from '../../utils/formatters';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';
export default function TaskDetails({ task }) { if (!task) return null; return <article className="task-details"><h2>{task.title}</h2><p>{task.description || 'No description provided.'}</p><dl><dt>Status</dt><dd><TaskStatusBadge status={task.status} /></dd><dt>Priority</dt><dd><TaskPriorityBadge priority={task.priority} /></dd><dt>Assignee</dt><dd>{task.assignedToName || 'Unassigned'}</dd><dt>Due</dt><dd>{formatDate(task.dueDate)}</dd><dt>Updated</dt><dd>{formatDateTime(task.updatedAt)}</dd></dl></article>; }
