import { formatStatus } from '../../utils/formatters';
export default function ProjectStatusBadge({ status }) { return <span className={`status-badge status-${String(status || '').toLowerCase()}`}>{formatStatus(status)}</span>; }
