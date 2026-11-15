import { formatDateTime } from '../../utils/formatters';
export default function ActivityFeed({ items = [] }) { return <ul className="activity-feed">{items.map((item) => <li key={item.id}><p>{item.description}</p><small>{item.userName} · {formatDateTime(item.createdAt)}</small></li>)}</ul>; }
