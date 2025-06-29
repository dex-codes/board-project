import React from 'react';

const AutomationDemo = ({ board }) => {
  const totalAutomations = board.statuses.reduce(
    (total, status) => total + (status.automations?.length || 0),
    0
  );

  const enabledAutomations = board.statuses.reduce(
    (total, status) => 
      total + (status.automations?.filter(rule => rule.enabled).length || 0),
    0
  );

  return (
    <div className="automation-demo">
      <div className="demo-header">
        <h3>🤖 Automation System</h3>
        <div className="automation-stats">
          <span className="stat-item">
            <strong>{enabledAutomations}</strong> active rules
          </span>
          <span className="stat-item">
            <strong>{totalAutomations}</strong> total rules
          </span>
        </div>
      </div>
      
      <div className="demo-instructions">
        <h4>Try the automation system:</h4>
        <ol>
          <li>Drag a task from "To Do" to "In Progress" - it will automatically get an "in-progress" tag</li>
          <li>Drag a task to "Done" - it will get a "completed" tag and show a celebration message</li>
          <li>Click the ⚙️ button on any column to configure custom automations</li>
          <li>Create rules like: "When task moves to Review → Send notification"</li>
        </ol>
      </div>

      <div className="demo-features">
        <h4>Available Automation Actions:</h4>
        <ul>
          <li><strong>Add Tag:</strong> Automatically tag tasks when they move</li>
          <li><strong>Remove Tag:</strong> Remove specific tags from tasks</li>
          <li><strong>Send Notification:</strong> Show console notifications (can be extended to real notifications)</li>
          <li><strong>Update Field:</strong> Modify any task field automatically</li>
        </ul>
      </div>

      <div className="demo-triggers">
        <h4>Automation Triggers:</h4>
        <ul>
          <li><strong>Move To:</strong> When a task is moved TO a specific status</li>
          <li><strong>Move From:</strong> When a task is moved FROM a specific status</li>
        </ul>
      </div>
    </div>
  );
};

export default AutomationDemo;
