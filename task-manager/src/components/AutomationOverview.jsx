import React from 'react';

const AutomationOverview = ({ board, onClose, onToggleRule }) => {
  const allRules = board.statuses.flatMap(status => 
    (status.automations || []).map(rule => ({
      ...rule,
      statusName: status.name,
      statusId: status.id,
      statusColor: status.color
    }))
  );

  const enabledRules = allRules.filter(rule => rule.enabled);
  const disabledRules = allRules.filter(rule => !rule.enabled);

  const handleToggleRule = (statusId, ruleId, currentEnabled) => {
    onToggleRule(statusId, ruleId, !currentEnabled);
  };

  const getActionSummary = (actions) => {
    if (actions.length === 0) return 'No actions';
    if (actions.length === 1) {
      const action = actions[0];
      switch (action.type) {
        case 'add_tag':
          return `Add "${action.config.tag}" tag`;
        case 'remove_tag':
          return `Remove "${action.config.tag}" tag`;
        case 'notification':
          return `Send notification`;
        case 'update_field':
          return `Update ${action.config.field}`;
        default:
          return action.type;
      }
    }
    return `${actions.length} actions`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal automation-overview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🤖 Automation Overview</h3>
          <button onClick={onClose} className="btn btn-ghost">×</button>
        </div>
        
        <div className="modal-content">
          <div className="automation-overview-stats">
            <div className="overview-stat-card">
              <span className="overview-stat-number">{allRules.length}</span>
              <span className="overview-stat-label">Total Rules</span>
            </div>
            <div className="overview-stat-card active">
              <span className="overview-stat-number">{enabledRules.length}</span>
              <span className="overview-stat-label">Active Rules</span>
            </div>
            <div className="overview-stat-card inactive">
              <span className="overview-stat-number">{disabledRules.length}</span>
              <span className="overview-stat-label">Inactive Rules</span>
            </div>
          </div>

          {allRules.length === 0 ? (
            <div className="no-rules">
              <div className="no-rules-icon">🤖</div>
              <h4>No Automation Rules Yet</h4>
              <p>Click the ⚙️ button on any status column to create your first automation rule.</p>
            </div>
          ) : (
            <>
              {enabledRules.length > 0 && (
                <div className="rules-section">
                  <h4 className="rules-section-title">✅ Active Rules ({enabledRules.length})</h4>
                  <div className="rules-list">
                    {enabledRules.map((rule) => (
                      <div key={`${rule.statusId}-${rule.id}`} className="rule-overview-item active">
                        <div className="rule-overview-header">
                          <div className="rule-overview-info">
                            <div className="rule-overview-name">{rule.name}</div>
                            <div className="rule-overview-status">
                              <span 
                                className="status-dot" 
                                style={{ backgroundColor: rule.statusColor }}
                              ></span>
                              {rule.statusName}
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleRule(rule.statusId, rule.id, rule.enabled)}
                            className="btn btn-ghost btn-sm rule-toggle"
                            title="Disable rule"
                          >
                            🟢
                          </button>
                        </div>
                        <div className="rule-overview-details">
                          <div className="rule-trigger">
                            <strong>Trigger:</strong> {rule.trigger === 'move_to' ? 'Move to this status' : 'Move from another status'}
                          </div>
                          <div className="rule-actions">
                            <strong>Actions:</strong> {getActionSummary(rule.actions)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {disabledRules.length > 0 && (
                <div className="rules-section">
                  <h4 className="rules-section-title">⏸️ Inactive Rules ({disabledRules.length})</h4>
                  <div className="rules-list">
                    {disabledRules.map((rule) => (
                      <div key={`${rule.statusId}-${rule.id}`} className="rule-overview-item inactive">
                        <div className="rule-overview-header">
                          <div className="rule-overview-info">
                            <div className="rule-overview-name">{rule.name}</div>
                            <div className="rule-overview-status">
                              <span 
                                className="status-dot" 
                                style={{ backgroundColor: rule.statusColor }}
                              ></span>
                              {rule.statusName}
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleRule(rule.statusId, rule.id, rule.enabled)}
                            className="btn btn-ghost btn-sm rule-toggle"
                            title="Enable rule"
                          >
                            ⚪
                          </button>
                        </div>
                        <div className="rule-overview-details">
                          <div className="rule-trigger">
                            <strong>Trigger:</strong> {rule.trigger === 'move_to' ? 'Move to this status' : 'Move from another status'}
                          </div>
                          <div className="rule-actions">
                            <strong>Actions:</strong> {getActionSummary(rule.actions)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="automation-overview-footer">
            <p><strong>💡 Tip:</strong> Click the ⚙️ button on any status column to create new automation rules or modify existing ones.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationOverview;
