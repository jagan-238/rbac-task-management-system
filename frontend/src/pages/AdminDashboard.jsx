import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { fetchAnalytics } from "../services/api";

const AdminDashboard = () => {
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

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Overview of your system</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading analytics...</div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={analytics?.totalUsers}
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Total Tasks"
                value={analytics?.totalTasks}
                icon="📋"
                color="purple"
              />
              <StatCard
                title="Completed Tasks"
                value={analytics?.completedTasks}
                icon="✅"
                color="green"
              />
              <StatCard
                title="Pending Tasks"
                value={analytics?.pendingTasks}
                icon="⏳"
                color="orange"
              />
            </div>

            {analytics && analytics.totalTasks > 0 && (
              <div className="progress-section">
                <h3>Task Completion Rate</h3>
                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.round(
                        (analytics.completedTasks / analytics.totalTasks) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="progress-label">
                  {Math.round(
                    (analytics.completedTasks / analytics.totalTasks) * 100
                  )}% complete
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
