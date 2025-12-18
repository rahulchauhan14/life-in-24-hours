import { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const categories = ['All', 'Work', 'Exercise', 'Entertainment', 'Sleep', 'Social', 'Learning', 'Meals', 'Other'];

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: filter.startDate,
        endDate: filter.endDate
      };
      if (filter.category && filter.category !== 'All') {
        params.category = filter.category;
      }
      const response = await api.get('/activities', { params });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await api.delete(`/activities/${id}`);
        setActivities(activities.filter(a => a._id !== id));
      } catch (error) {
        alert('Failed to delete activity');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: '#667eea',
      Exercise: '#43e97b',
      Entertainment: '#f093fb',
      Sleep: '#4facfe',
      Social: '#fa709a',
      Learning: '#fee140',
      Meals: '#30cfd0',
      Other: '#a8a8a8'
    };
    return colors[category] || '#667eea';
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>📋 Activity Log</h2>

      <div className="card">
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No activities found. Start logging your daily activities!
          </p>
        </div>
      ) : (
        <div className="card">
          <h3>Activities ({activities.length})</h3>
          <div style={{ marginTop: '20px' }}>
            {activities.map(activity => (
              <div
                key={activity._id}
                style={{
                  padding: '15px',
                  borderLeft: `4px solid ${getCategoryColor(activity.category)}`,
                  background: '#f7fafc',
                  marginBottom: '10px',
                  borderRadius: '5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{activity.title}</h4>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                      <span>
                        <strong>Category:</strong>{' '}
                        <span style={{ color: getCategoryColor(activity.category), fontWeight: 'bold' }}>
                          {activity.category}
                        </span>
                      </span>
                      <span><strong>Date:</strong> {format(new Date(activity.date), 'MMM dd, yyyy')}</span>
                      <span>
                        <strong>Time:</strong> {format(new Date(activity.startTime), 'HH:mm')} - {format(new Date(activity.endTime), 'HH:mm')}
                      </span>
                      <span><strong>Duration:</strong> {activity.duration} min</span>
                    </div>
                    {activity.notes && (
                      <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#555' }}>
                        📝 {activity.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 15px', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityList;
