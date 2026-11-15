import NotificationItem from './NotificationItem';
export default function NotificationList({ items = [], onRead, onDelete }) { return <div className="notification-list">{items.map((item) => <NotificationItem key={item.id} notification={item} onRead={onRead} onDelete={onDelete} />)}</div>; }
