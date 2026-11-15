import { useCallback, useEffect, useState } from 'react';
import projectApi from '../api/projectApi';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setLoading(true);
    try { setProjects(await projectApi.getProjects()); setError(''); }
    catch { setError('Projects could not be loaded.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { projects, setProjects, loading, error, reload };
}
