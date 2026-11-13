import { useEffect, useState } from 'react';
import reportApi from '../../api/reportApi';

function ReportsPage() {
  const [report, setReport] = useState({ totalProductivity: 0, workloadByPerson: [] });

  useEffect(() => {
    const load = async () => {
      const data = await reportApi.getReports();
      setReport(data);
    };

    load();
  }, []);

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Reports</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Productivity</span>
          <strong>{report.totalProductivity || 0}%</strong>
        </div>
      </div>

      <div className="panel">
        <h3>Team workload</h3>
        <div className="list-stack">
          {(report.workloadByPerson || []).map((person) => (
            <div key={person.name} className="list-item-card">
              <strong>{person.name}</strong>
              <small>{person.value}%</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
