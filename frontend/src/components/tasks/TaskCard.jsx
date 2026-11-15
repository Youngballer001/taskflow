import { Link } from 'react-router-dom';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';
import { formatDate } from '../../utils/formatters';
export default function TaskCard({ task }) { return <article className="task-card"><header><Link to={`/tasks/${task.id}`}>{task.title}</Link><TaskPriorityBadge priority={task.priority} /></header><p>{task.description}</p><footer><TaskStatusBadge status={task.status} /><span>{task.assignedToName || 'Unassigned'}</span><time>{formatDate(task.dueDate)}</time></footer></article>; }
