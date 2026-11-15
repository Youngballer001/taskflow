import { Link } from 'react-router-dom';
import TaskPriorityBadge from '../tasks/TaskPriorityBadge';
import { formatDate } from '../../utils/formatters';

export default function DraggableTaskCard({ task, disabled = false }) {
  return <article className={`kanban-card ${disabled ? 'is-saving' : ''}`} draggable={!disabled} onDragStart={(event) => { event.dataTransfer.setData('text/task-id', String(task.id)); event.dataTransfer.effectAllowed = 'move'; }}><Link to={`/tasks/${task.id}`} className="kanban-card-title">{task.title}</Link><div className="kanban-card-meta"><TaskPriorityBadge priority={task.priority} />{task.projectName && <small>{task.projectName}</small>}</div><small>{task.assignedToName || 'Unassigned'}{task.dueDate ? ` · ${formatDate(task.dueDate)}` : ''}</small></article>;
}
