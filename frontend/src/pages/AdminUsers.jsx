import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchAllUsers, updateUserStatus, deleteUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateUserStatus(userId, newStatus);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user and all their data?")) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Users</h1>
            <p className="page-subtitle">{users.length} registered users</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={user._id === currentUser._id ? "current-user-row" : ""}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                        {user._id === currentUser._id && (
                          <span className="you-badge">you</span>
                        )}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-tag role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user._id !== currentUser._id && (
                        <div className="table-actions">
                          <button
                            className={`btn btn-sm ${user.status === "active" ? "btn-warning" : "btn-success"}`}
                            onClick={() => handleStatusToggle(user._id, user.status)}
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
