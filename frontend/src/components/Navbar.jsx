import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>⏰ Life in 24 Hours</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-activity">Add Activity</Link>
          <Link to="/activities">Activities</Link>
          <span style={{ marginLeft: '20px', color: '#666' }}>
            Welcome, {user.name}
          </span>
          <button onClick={onLogout} className="btn btn-primary" style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
