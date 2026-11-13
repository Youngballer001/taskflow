import { useParams } from 'react-router-dom';

function MemberDetailsPage() {
  const { id } = useParams();

  return (
    <div className="page-block">
      <div className="page-header">
        <h2>Team member {id}</h2>
      </div>
      <div className="panel">
        <p>Member details are available once the backend member API is connected.</p>
      </div>
    </div>
  );
}

export default MemberDetailsPage;

