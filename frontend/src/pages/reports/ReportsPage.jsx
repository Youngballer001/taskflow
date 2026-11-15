import { useEffect, useState } from 'react';
import reportApi from '../../api/reportApi';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import ProjectProgressChart from '../../components/charts/ProjectProgressChart';

function ReportsPage() {
  const [report, setReport] = useState({ completionRate: 0, overdueTasks: 0, activeProjects: 0, taskStatusCounts: {} });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setReport(await reportApi.getReports());
      } catch {
        setError('Reports could not be loaded. Please try again.');
      }
    };

    load();
  }, []);

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Reports</h2>
      </div>
      {error && <p role="alert" className="error-box">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Productivity</span>
          <strong>{Math.round(report.completionRate || 0)}%</strong>
        </div>
        <div className="stat-card"><span>Overdue tasks</span><strong>{report.overdueTasks || 0}</strong></div>
        <div className="stat-card"><span>Active projects</span><strong>{report.activeProjects || 0}</strong></div>
      </div>

      <div className="report-chart-grid"><section className="panel"><h3>Tasks by status</h3><TaskStatusChart data={report.taskStatusCounts || {}} /></section><section className="panel"><h3>Projects by status</h3><ProjectProgressChart data={report.projectStatusCounts || {}} /></section></div>
    </div>
  );
}

export default ReportsPage;
