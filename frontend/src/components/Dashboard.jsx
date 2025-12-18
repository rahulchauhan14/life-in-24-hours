import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';
import { format } from 'date-fns';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [categoryData, setCategoryData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [productivityScore, setProductivityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [categoryRes, dailyRes, productivityRes] = await Promise.all([
        api.get('/activities/analytics/category', { params: dateRange }),
        api.get('/activities/analytics/daily', { params: dateRange }),
        api.get('/activities/analytics/productivity', { params: { date: dateRange.endDate } })
      ]);

      setCategoryData(categoryRes.data);
      setDailyData(dailyRes.data);
      setProductivityScore(productivityRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  const categoryChartData = {
    labels: categoryData?.map(item => item.category) || [],
    datasets: [{
      label: 'Hours Spent',
      data: categoryData?.map(item => item.totalHours) || [],
      backgroundColor: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#4facfe',
        '#43e97b',
        '#fa709a',
        '#fee140',
        '#30cfd0'
      ]
    }]
  };

  const dailyChartData = {
    labels: dailyData?.map(item => format(new Date(item.date), 'MMM dd')) || [],
    datasets: [{
      label: 'Hours per Day',
      data: dailyData?.map(item => item.totalHours) || [],
      backgroundColor: '#667eea'
    }]
  };

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>📊 Your Time Analytics</h2>
      
      <div className="card">
        <h3>Date Range</h3>
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {productivityScore && (
        <div className="card">
          <h3>⭐ Productivity Score (Today)</h3>
          <div style={{ fontSize: '48px', textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
            {productivityScore.productivityScore}%
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <p style={{ color: '#666' }}>Productive Hours</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{productivityScore.productiveHours}h</p>
            </div>
            <div>
              <p style={{ color: '#666' }}>Total Hours Logged</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{productivityScore.totalHours}h</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>Time by Category</h3>
          {categoryData && categoryData.length > 0 ? (
            <Pie data={categoryChartData} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No data available. Start logging activities!
            </p>
          )}
        </div>

        <div className="card">
          <h3>Daily Activity</h3>
          {dailyData && dailyData.length > 0 ? (
            <Bar data={dailyChartData} options={{ responsive: true }} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No data available. Start logging activities!
            </p>
          )}
        </div>
      </div>

      {categoryData && categoryData.length > 0 && (
        <div className="card">
          <h3>Category Breakdown</h3>
          <table style={{ width: '100%', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Activities</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{item.category}</td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>{item.count}</td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>{item.totalHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
