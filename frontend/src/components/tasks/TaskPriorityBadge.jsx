export default function TaskPriorityBadge({ priority = 'MEDIUM' }) { return <span className={`priority-badge priority-${priority.toLowerCase()}`}>{priority}</span>; }
