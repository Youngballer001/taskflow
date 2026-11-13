import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your sprint review is tomorrow.', read: false },
    { id: 2, message: 'Alex completed the onboarding checklist.', read: true },
  ]);

  const addNotification = (message) => {
    setNotifications((current) => [
      { id: Date.now(), message, read: false },
      ...current,
    ]);
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const value = useMemo(
    () => ({ notifications, addNotification, markAllAsRead }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
