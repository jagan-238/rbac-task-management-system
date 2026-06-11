import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import TaskModal from "../components/TaskModal";
import {
  fetchMyTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await fetchMyTasks();
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

  const handleCreate = async (formData) => {
    try {
      await createTask(formData);
      setShowModal(false);
      loadTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateTask(editingTask._id, formData);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
  };

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
            <h1>My Tasks</h1>
            <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? "s" : ""} total</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Task
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>📭</p>
            <p>No tasks yet. Create your first task!</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create Task
            </button>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.status === "completed" ? "task-completed" : ""}`}>
                <div className="task-card-header">
                  <span className={`priority-badge ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status}
                  </span>
                </div>

                <h3 className="task-title">{task.title}</h3>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-footer">
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <div className="task-actions">
                    <button
                      className="btn-icon btn-icon--edit"
                      onClick={() => openEdit(task)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon--delete"
                      onClick={() => handleDelete(task._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <TaskModal
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
          />
        )}

        {editingTask && (
          <TaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={handleUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
