import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import ProjectDetailsPage from '../pages/projects/ProjectDetailsPage';
import CreateProjectPage from '../pages/projects/CreateProjectPage';
import EditProjectPage from '../pages/projects/EditProjectPage';
import TasksPage from '../pages/tasks/TasksPage';
import TaskDetailsPage from '../pages/tasks/TaskDetailsPage';
import KanbanPage from '../pages/tasks/KanbanPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import TeamPage from '../pages/team/TeamPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/projects/create" element={<ProtectedRoute><DashboardLayout><CreateProjectPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/projects/:id/edit" element={<ProtectedRoute><DashboardLayout><EditProjectPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><DashboardLayout><ProjectDetailsPage /></DashboardLayout></ProtectedRoute>} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TasksPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/tasks/:id" element={<ProtectedRoute><DashboardLayout><TaskDetailsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/kanban" element={<ProtectedRoute><DashboardLayout><KanbanPage /></DashboardLayout></ProtectedRoute>} />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/reports" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<div className="page-container"><p>Loading reports…</p></div>}><ReportsPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeamPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout>
              <AdminDashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout><UserManagementPage /></DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default AppRoutes;
