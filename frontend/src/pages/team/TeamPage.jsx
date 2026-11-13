import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';

function TeamPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await userApi.getUsers();
      setMembers(data);
    };

    load();
  }, []);

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Team</h2>
      </div>
      <div className="panel list-stack">
        {members.map((member) => (
          <div key={member.id} className="list-item-card">
            <div>
              <strong>{member.fullName}</strong>
              <p>{member.email}</p>
            </div>
            <span className="pill medium">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPage;
