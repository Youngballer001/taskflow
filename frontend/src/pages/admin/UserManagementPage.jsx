import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import { USER_ROLES } from '../../utils/constants';
import useDebounce from '../../hooks/useDebounce';

function UserManagementPage() {
  const [query, setQuery] = useState('');
  const search = useDebounce(query, 250);
  const [result, setResult] = useState({ content: [], number: 0, totalPages: 0, totalElements: 0 });
  const [error, setError] = useState('');
  const load = async (page = 0) => { try { setError(''); setResult(await userApi.getUsers({ search, page, size: 20, sort: 'createdAt,desc' })); } catch { setError('Users could not be loaded.'); } };
  useEffect(() => { load(0); }, [search]);
  const setRole = async (user, role) => { try { await userApi.updateUserRole(user.id, role); await load(result.number); } catch { setError(`Could not change ${user.fullName}'s role.`); } };
  const toggleActive = async (user) => { try { await userApi.setUserActive(user.id, !user.isActive); await load(result.number); } catch { setError(`Could not update ${user.fullName}'s account.`); } };
  return <div className="page-block"><header className="page-header"><h2>User management</h2><input type="search" aria-label="Search users" placeholder="Search name or email" value={query} onChange={(event) => setQuery(event.target.value)} /></header>{error && <p role="alert" className="error-box">{error}</p>}<div className="panel"><div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Account</th><th>Actions</th></tr></thead><tbody>{result.content.map((user) => <tr key={user.id}><td>{user.fullName}</td><td>{user.email}</td><td><select aria-label={`Role for ${user.fullName}`} value={user.role} onChange={(event) => setRole(user, event.target.value)}>{USER_ROLES.map((role) => <option key={role}>{role}</option>)}</select></td><td>{user.isActive ? 'Active' : 'Inactive'}</td><td><button type="button" onClick={() => toggleActive(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table>{!result.content.length && <p>No users match this search.</p>}</div><div className="pagination"><button disabled={result.number <= 0} onClick={() => load(result.number - 1)}>Previous</button><span>{result.totalElements} users · Page {result.totalPages ? result.number + 1 : 0} of {result.totalPages}</span><button disabled={result.number >= result.totalPages - 1} onClick={() => load(result.number + 1)}>Next</button></div></div></div>;
}

export default UserManagementPage;

