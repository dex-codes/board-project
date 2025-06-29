import React, { useState } from 'react';
import { createAutomationRule } from '../utils/boardUtils';
import { AUTOMATION_ACTION_TYPES, AUTOMATION_TRIGGER_TYPES } from '../types';

const AutomationModal = ({ 
  board, 
  statusId, 
  onClose, 
  onSaveAutomation 
}) => {
  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState(AUTOMATION_TRIGGER_TYPES.MOVE_TO);
  const [fromStatusId, setFromStatusId] = useState('');
  const [toStatusId, setToStatusId] = useState(statusId);
  const [actions, setActions] = useState([]);
  const [newAction, setNewAction] = useState({
    type: AUTOMATION_ACTION_TYPES.ADD_TAG,
    config: {}
  });

  const currentStatus = board.statuses.find(s => s.id === statusId);
  const existingRules = currentStatus?.automations || [];

  const handleAddAction = () => {
    if (newAction.type && Object.keys(newAction.config).length > 0) {
      setActions([...actions, { ...newAction, id: Date.now() }]);
      setNewAction({
        type: AUTOMATION_ACTION_TYPES.ADD_TAG,
        config: {}
      });
    }
  };

  const handleRemoveAction = (actionId) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  const handleSave = () => {
    if (!ruleName.trim() || actions.length === 0) {
      alert('Please provide a rule name and at least one action.');
      return;
    }

    const rule = createAutomationRule(ruleName, trigger, {
      fromStatusId: trigger === AUTOMATION_TRIGGER_TYPES.MOVE_FROM ? fromStatusId : null,
      toStatusId: trigger === AUTOMATION_TRIGGER_TYPES.MOVE_TO ? toStatusId : null,
      actions: actions.map(({ id, ...action }) => action)
    });

    onSaveAutomation(statusId, rule);
    onClose();
  };

  const handleActionConfigChange = (field, value) => {
    setNewAction({
      ...newAction,
      config: {
        ...newAction.config,
        [field]: value
      }
    });
  };

  const renderActionConfig = () => {
    switch (newAction.type) {
      case AUTOMATION_ACTION_TYPES.ADD_TAG:
      case AUTOMATION_ACTION_TYPES.REMOVE_TAG:
        return (
          <input
            type="text"
            placeholder="Tag name"
            value={newAction.config.tag || ''}
            onChange={(e) => handleActionConfigChange('tag', e.target.value)}
            className="task-title-input"
          />
        );
      
      case AUTOMATION_ACTION_TYPES.NOTIFICATION:
        return (
          <input
            type="text"
            placeholder="Notification message"
            value={newAction.config.message || ''}
            onChange={(e) => handleActionConfigChange('message', e.target.value)}
            className="task-title-input"
          />
        );
      
      case AUTOMATION_ACTION_TYPES.UPDATE_FIELD:
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Field name"
              value={newAction.config.field || ''}
              onChange={(e) => handleActionConfigChange('field', e.target.value)}
              className="task-title-input"
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="New value"
              value={newAction.config.value || ''}
              onChange={(e) => handleActionConfigChange('value', e.target.value)}
              className="task-title-input"
              style={{ flex: 1 }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal automation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Configure Automations - {currentStatus?.name}</h3>
          <button onClick={onClose} className="btn btn-ghost">×</button>
        </div>
        
        <div className="modal-content">
          {/* Existing Rules */}
          {existingRules.length > 0 && (
            <div className="existing-rules">
              <h4>Existing Rules</h4>
              {existingRules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-header">
                    <span className="rule-name">{rule.name}</span>
                    <span className={`rule-status ${rule.enabled ? 'enabled' : 'disabled'}`}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="rule-details">
                    <small>
                      Trigger: {rule.trigger} | Actions: {rule.actions.length}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Rule Form */}
          <div className="new-rule-form">
            <h4>Create New Rule</h4>
            
            <div className="form-group">
              <label>Rule Name</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter rule name..."
                className="task-title-input"
              />
            </div>

            <div className="form-group">
              <label>Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="form-select"
              >
                <option value={AUTOMATION_TRIGGER_TYPES.MOVE_TO}>
                  When task moves TO this status
                </option>
                <option value={AUTOMATION_TRIGGER_TYPES.MOVE_FROM}>
                  When task moves FROM another status
                </option>
              </select>
            </div>

            {trigger === AUTOMATION_TRIGGER_TYPES.MOVE_FROM && (
              <div className="form-group">
                <label>From Status</label>
                <select
                  value={fromStatusId}
                  onChange={(e) => setFromStatusId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select status...</option>
                  {board.statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {trigger === AUTOMATION_TRIGGER_TYPES.MOVE_TO && (
              <div className="form-group">
                <label>To Status</label>
                <select
                  value={toStatusId}
                  onChange={(e) => setToStatusId(e.target.value)}
                  className="form-select"
                >
                  {board.statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="form-group">
              <label>Actions ({actions.length})</label>
              
              {actions.map((action) => (
                <div key={action.id} className="action-item">
                  <span className="action-type">{action.type}</span>
                  <span className="action-config">
                    {JSON.stringify(action.config)}
                  </span>
                  <button
                    onClick={() => handleRemoveAction(action.id)}
                    className="btn btn-ghost btn-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="add-action-form">
                <select
                  value={newAction.type}
                  onChange={(e) => setNewAction({ type: e.target.value, config: {} })}
                  className="form-select"
                >
                  <option value={AUTOMATION_ACTION_TYPES.ADD_TAG}>Add Tag</option>
                  <option value={AUTOMATION_ACTION_TYPES.REMOVE_TAG}>Remove Tag</option>
                  <option value={AUTOMATION_ACTION_TYPES.NOTIFICATION}>Send Notification</option>
                  <option value={AUTOMATION_ACTION_TYPES.UPDATE_FIELD}>Update Field</option>
                </select>
                
                {renderActionConfig()}
                
                <button onClick={handleAddAction} className="btn btn-outline btn-sm">
                  Add Action
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSave} className="btn btn-primary">
                Save Rule
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationModal;
