const routeConfig = [
  { path: '/login', name: 'Login', requiresAuth: false },
  { path: '/register', name: 'Register', requiresAuth: false },
  { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
  { path: '/projects', name: 'Projects', requiresAuth: true },
  { path: '/tasks', name: 'Tasks', requiresAuth: true },
  { path: '/notifications', name: 'Notifications', requiresAuth: true },
  { path: '/reports', name: 'Reports', requiresAuth: true },
  { path: '/profile', name: 'Profile', requiresAuth: true },
  { path: '/settings', name: 'Settings', requiresAuth: true },
  { path: '/team', name: 'Team', requiresAuth: true },
  { path: '/admin', name: 'Admin', requiresAuth: true },
];

export default routeConfig;
