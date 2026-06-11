import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchActivityLogs } from "../services/api";

const actionIcons = {
  LOGIN: "🔐",
  TASK_CREATED: "➕",
  TASK_UPDATED: "✏️",
  TASK_DELETED: "🗑️",
};

const actionColors = {
  LOGIN: "log-login",
  TASK_CREATED: "log-created",
  TASK_UPDATED: "log-updated",
  TASK_DELETED: "log-deleted",
};

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetchActivityLogs();
        setLogs(res.data);
      } catch (err) {
        setError("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.action === filter;
  });

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Activity Logs</h1>
            <p className="page-subtitle">Last {logs.length} recorded activities</p>
          </div>
          <div className="filter-tabs">
            {["all", "LOGIN", "TASK_CREATED", "TASK_UPDATED", "TASK_DELETED"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {actionIcons[f] || ""} {f === "all" ? "All" : f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map((log) => (
              <div key={log._id} className={`log-item ${actionColors[log.action] || ""}`}>
                <div className="log-icon">{actionIcons[log.action] || "📌"}</div>
                <div className="log-body">
                  <p className="log-description">{log.description}</p>
                  <div className="log-meta">
                    <span className="log-user">
                      {log.userId?.name || "Unknown User"} ({log.userId?.email})
                    </span>
                    <span className="log-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className={`log-action-tag log-action-${log.action?.toLowerCase()}`}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminLogs;
