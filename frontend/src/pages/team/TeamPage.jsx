import { useEffect, useState } from 'react';
import projectApi from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';

function TeamPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const loadMembers = async (id) => {
    if (!id) { setMembers([]); return; }
    try { setMembers(await projectApi.getProjectMembers(id)); setError(''); }
    catch { setError('Project members could not be loaded.'); }
  };
  useEffect(() => {
    projectApi.getProjects().then((list) => { setProjects(list); if (list.length) setProjectId(String(list[0].id)); })
      .catch(() => setError('Your projects could not be loaded.'));
  }, []);
  useEffect(() => { if (projectId) loadMembers(projectId); }, [projectId]);
  const addMember = async (event) => {
    event.preventDefault();
    try { await projectApi.addProjectMember(projectId, { email }); setEmail(''); await loadMembers(projectId); }
    catch { setError('Member could not be added. Verify the email and your project permissions.'); }
  };
  const removeMember = async (id) => {
    try { await projectApi.removeProjectMember(projectId, id); await loadMembers(projectId); }
    catch { setError('Member could not be removed.'); }
  };
  const canManage = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER'
    || members.some((member) => member.userId === user?.id && member.role === 'OWNER');
  return <div className="page-block"><header className="page-header"><h2>Team</h2><select aria-label="Choose project" value={projectId} onChange={(event) => setProjectId(event.target.value)}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></header>
    {error && <p role="alert" className="error-box">{error}</p>}
    {canManage && projectId && <form className="inline-form" onSubmit={addMember}><label>Add registered member by email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><button className="primary-button">Add member</button></form>}
    <div className="panel list-stack">{members.map((member) => <div key={member.id} className="list-item-card"><div><strong>{member.fullName}</strong><p>{member.email}</p></div><span className="pill medium">{member.role}</span>{canManage && member.role !== 'OWNER' && <button type="button" onClick={() => removeMember(member.userId)}>Remove</button>}</div>)}{!members.length && !error && <p>No project members found.</p>}</div>
  </div>;
}
export default TeamPage;
