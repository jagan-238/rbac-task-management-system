import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-value">{value ?? "—"}</p>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
