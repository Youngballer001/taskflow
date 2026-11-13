import { useEffect, useState } from 'react';
import dashboardApi from '../../api/dashboardApi';

const defaultOverview = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  recentTasks: [],
};

function DashboardPage() {
  const [overview, setOverview] = useState(defaultOverview);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      try {
        const data = await dashboardApi.getOverview();
        setOverview(data);
      } catch (error) {
        setOverview(defaultOverview);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const cards = [
    { label: 'Projects', value: overview.totalProjects || 0 },
    { label: 'Tasks', value: overview.totalTasks || 0 },
    { label: 'Completed', value: overview.completedTasks || 0 },
    { label: 'Overdue', value: overview.overdueTasks || 0 },
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard…</p>
      ) : (
        <>
          <div className="stats-grid">
            {cards.map((card) => (
              <div key={card.label} className="stat-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="panel-grid">
            <div className="panel">
              <h3>Recent activity</h3>
              <ul className="list-view">
                {(overview.recentTasks || []).map((task) => (
                  <li key={task.id}>
                    <span>{task.title}</span>
                    <small>{task.status}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <h3>Priority snapshot</h3>
              <div className="pill-list">
                <span className="pill high">High: {overview.priorityStats?.HIGH || 0}</span>
                <span className="pill medium">Medium: {overview.priorityStats?.MEDIUM || 0}</span>
                <span className="pill low">Low: {overview.priorityStats?.LOW || 0}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
