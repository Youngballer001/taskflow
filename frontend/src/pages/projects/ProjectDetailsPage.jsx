import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';

function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await projectApi.getProjectById(id);
      setProject(data);
    };

    load();
  }, [id]);

  if (!project) {
    return <div className="empty-state">Loading project…</div>;
  }

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>{project.name}</h2>
      </div>
      <div className="panel">
        <p>{project.description}</p>
        <p>Owner: {project.ownerName}</p>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;

