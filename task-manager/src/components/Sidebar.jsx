import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({ board, onUpdateBoard, onShowAutomationOverview }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentTheme, predefinedThemes, changeTheme } = useTheme();

  const totalTasks = board.tasks.length;
  const tasksByStatus = board.statuses.map((status) => ({
    ...status,
    count: board.tasks.filter((task) => task.statusId === status.id).length,
  }));

  const totalAutomations = board.statuses.reduce(
    (total, status) => total + (status.automations?.length || 0),
    0
  );

  const activeAutomations = board.statuses.reduce(
    (total, status) =>
      total + (status.automations?.filter((rule) => rule.enabled).length || 0),
    0
  );

  const recentTasks = board.tasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          {!isCollapsed && (
            <>
              <h2>📋 Task Manager</h2>
              <p>Bespoke Project Management</p>
            </>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-toggle"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-content">
          <br />
          <br />

          {/* Board Overview */}
          <div className="sidebar-section">
            <h3>📊 Board Overview</h3>
            <div className="overview-stats">
              <div className="stat-card">
                <span className="stat-number">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{activeAutomations}</span>
                <span className="stat-label">Active Rules</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="sidebar-section">
            <h3>📈 Status Breakdown</h3>
            <div className="status-list">
              {tasksByStatus.map((status) => (
                <div key={status.id} className="status-item">
                  <div
                    className="status-indicator"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="status-name">{status.name}</span>
                  <span className="status-count">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Center */}
          <div className="sidebar-section">
            <h3>🤖 Automation Center</h3>
            <div className="automation-summary">
              <div className="automation-stat">
                <span className="automation-number">{totalAutomations}</span>
                <span className="automation-label">Total Rules</span>
              </div>
              <div className="automation-stat">
                <span className="automation-number">{activeAutomations}</span>
                <span className="automation-label">Active</span>
              </div>
            </div>
            <button
              onClick={onShowAutomationOverview}
              className="btn btn-outline btn-sm sidebar-btn"
            >
              View All Rules
            </button>
          </div>

          {/* Recent Activity */}
          <div className="sidebar-section">
            <h3>🕒 Recent Activity</h3>
            <div className="recent-tasks">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="recent-task">
                    <div className="recent-task-title">{task.title}</div>
                    <div className="recent-task-meta">
                      <span className="recent-task-status">
                        {
                          board.statuses.find((s) => s.id === task.statusId)
                            ?.name
                        }
                      </span>
                      <span className="recent-task-time">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-recent">No recent activity</p>
              )}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="sidebar-section">
            <h3>🎨 Theme</h3>
            <div className="theme-selector">
              <div className="current-theme-display">
                <span className="theme-name">{currentTheme.name}</span>
                <span className="theme-mode">{currentTheme.mode}</span>
              </div>
              <div className="theme-options">
                {Object.entries(predefinedThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key)}
                    className={`theme-option-btn ${
                      currentTheme.name === theme.name ? "active" : ""
                    }`}
                    title={theme.name}
                  >
                    <div className="theme-preview">
                      <div
                        className="theme-color-dot"
                        style={{ backgroundColor: theme.colors.accent }}
                      ></div>
                      <span>{theme.name.split(" ")[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="btn btn-primary btn-sm sidebar-btn">
                + New Task
              </button>
              <button className="btn btn-outline btn-sm sidebar-btn">
                📊 Export Data
              </button>
              <button className="btn btn-outline btn-sm sidebar-btn">
                ⚙️ Settings
              </button>
            </div>
          </div>

          {/* Board Info */}
          <div className="sidebar-section sidebar-footer">
            <div className="board-info">
              <h4>{board.name}</h4>
              <p>{board.description}</p>
              <small>
                Created: {new Date(board.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
