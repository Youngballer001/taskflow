import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from '../../components/notifications/NotificationItem';
import EmptyState from '../../components/common/EmptyState';

function NotificationsPage() {
  const { notifications, loading, error, markAllAsRead, markAsRead, remove } = useNotifications();
  return <div className="page-block"><header className="page-header"><div><p className="eyebrow">Personal</p><h2>Notifications</h2><p>Your project and task updates in one place.</p></div><button type="button" className="secondary-button" onClick={markAllAsRead} disabled={!notifications.some((item) => !item.isRead)}>Mark all as read</button></header>{error && <p role="alert" className="error-box">{error}</p>}{loading ? <p>Loading notifications...</p> : notifications.length ? <div className="notification-list">{notifications.map((item) => <NotificationItem key={item.id} notification={item} onRead={markAsRead} onDelete={remove} />)}</div> : <section className="panel"><EmptyState title="You're all caught up" description="New project and task updates will appear here." /></section>}</div>;
}
export default NotificationsPage;
