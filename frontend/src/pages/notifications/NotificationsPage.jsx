import { useEffect, useState } from 'react';
import notificationApi from '../../api/notificationApi';

function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await notificationApi.getNotifications();
      setItems(data);
    };

    load();
  }, []);

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Notifications</h2>
      </div>
      <div className="panel list-stack">
        {items.map((item) => (
          <div key={item.id} className={`list-item-card ${item.read ? 'muted' : ''}`}>
            <div>
              <strong>{item.message}</strong>
            </div>
            <small>{item.read ? 'Read' : 'Unread'}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
