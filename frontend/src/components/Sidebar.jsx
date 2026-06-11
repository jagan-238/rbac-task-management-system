import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">TaskFlow</span>
        </div>
        <div className="user-badge">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <span className={`role-tag role-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user?.role === "admin" ? (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">▦</span> Dashboard
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">👥</span> Users
            </NavLink>
            <NavLink to="/admin/tasks" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">✅</span> Tasks
            </NavLink>
            <NavLink to="/admin/logs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">📋</span> Activity Logs
            </NavLink>
            <NavLink to="/admin/analytics" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">📊</span> Analytics
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">✅</span> My Tasks
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>⎋</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
