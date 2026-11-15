import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
export default function NotificationBell({ unreadCount = 0 }) { return <Link className="notification-bell" to="/notifications" aria-label={`${unreadCount} unread notifications`} title="Notifications"><Icon name="bell" size={17} />{unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>}</Link>; }
