import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchAllTasks, adminDeleteTask } from "../services/api";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTasks = async () => {
    try {
      const res = await fetchAllTasks();
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await adminDeleteTask(taskId);
      loadTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const priorityColors = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
  };

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>All Tasks</h1>
            <p className="page-subtitle">{tasks.length} tasks across all users</p>
          </div>
          <div className="filter-tabs">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">No tasks found</td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <div>
                          <p className="task-name">{task.title}</p>
                          {task.description && (
                            <p className="task-desc-preview">{task.description}</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {task.userId?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p>{task.userId?.name || "Unknown"}</p>
                            <p className="text-muted">{task.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`priority-badge ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminTasks;
