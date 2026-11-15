import { useCallback, useEffect, useState } from 'react';
import notificationApi from '../api/notificationApi';

export default function useNotifications({ enabled = true } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setLoading(true);
    try { setNotifications(await notificationApi.getNotifications()); setError(''); }
    catch { setError('Notifications could not be loaded.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { if (enabled) reload(); else { setNotifications([]); setLoading(false); } }, [enabled, reload]);
  const markAsRead = async (id) => { try { const changed = await notificationApi.markAsRead(id); setNotifications((current) => current.map((item) => item.id === id ? changed : item)); setError(''); } catch { setError('Notification could not be updated. Please try again.'); } };
  const markAllAsRead = async () => { try { await notificationApi.markAllAsRead(); setNotifications((current) => current.map((item) => ({ ...item, isRead: true }))); setError(''); } catch { setError('Notifications could not be updated. Please try again.'); } };
  const remove = async (id) => { try { await notificationApi.deleteNotification(id); setNotifications((current) => current.filter((item) => item.id !== id)); setError(''); } catch { setError('Notification could not be deleted. Please try again.'); } };
  return { notifications, unreadCount: notifications.filter((item) => !item.isRead).length, loading, error, reload, markAsRead, markAllAsRead, remove };
}
