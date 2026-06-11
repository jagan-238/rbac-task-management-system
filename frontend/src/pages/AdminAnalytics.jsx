import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { fetchAnalytics } from "../services/api";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const completionRate =
    analytics?.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0;

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p className="page-subtitle">System-wide statistics</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading analytics...</div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard title="Total Users" value={analytics?.totalUsers} icon="👥" color="blue" />
              <StatCard title="Total Tasks" value={analytics?.totalTasks} icon="📋" color="purple" />
              <StatCard title="Completed" value={analytics?.completedTasks} icon="✅" color="green" />
              <StatCard title="Pending" value={analytics?.pendingTasks} icon="⏳" color="orange" />
            </div>

            <div className="analytics-section">
              <h3>Task Status Breakdown</h3>
              <div className="breakdown-cards">
                <div className="breakdown-card">
                  <div className="breakdown-bar-container">
                    <div
                      className="breakdown-bar breakdown-bar--completed"
                      style={{ width: `${completionRate}%` }}
                    />
                    <div
                      className="breakdown-bar breakdown-bar--pending"
                      style={{ width: `${100 - completionRate}%` }}
                    />
                  </div>
                  <div className="breakdown-legend">
                    <span className="legend-item legend-completed">
                      ● Completed ({analytics?.completedTasks})
                    </span>
                    <span className="legend-item legend-pending">
                      ● Pending ({analytics?.pendingTasks})
                    </span>
                  </div>
                  <p className="breakdown-rate">{completionRate}% completion rate</p>
                </div>
              </div>
            </div>

            <div className="analytics-section">
              <h3>Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Avg tasks per user</span>
                  <span className="summary-value">
                    {analytics?.totalUsers > 0
                      ? (analytics.totalTasks / analytics.totalUsers).toFixed(1)
                      : 0}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Completion rate</span>
                  <span className="summary-value">{completionRate}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pending rate</span>
                  <span className="summary-value">{100 - completionRate}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
