import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, board, onClose, onSave, onDelete }) => {
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    statusId: task.statusId,
    tags: [...task.tags]
  });
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedTask({
      title: task.title,
      description: task.description,
      statusId: task.statusId,
      tags: [...task.tags]
    });
  }, [task]);

  const handleSave = () => {
    if (editedTask.title.trim()) {
      onSave(task.id, {
        title: editedTask.title.trim(),
        description: editedTask.description.trim(),
        statusId: editedTask.statusId,
        tags: editedTask.tags
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      statusId: task.statusId,
      tags: [...task.tags]
    });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTask.tags.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (e.target.name === 'newTag') {
        handleAddTag();
      } else if (isEditing) {
        handleSave();
      }
    } else if (e.key === 'Escape') {
      if (isEditing) {
        handleCancel();
      } else {
        onClose();
      }
    }
  };

  const currentStatus = board.statuses.find(s => s.id === task.statusId);
  const hasChanges = 
    editedTask.title !== task.title ||
    editedTask.description !== task.description ||
    editedTask.statusId !== task.statusId ||
    JSON.stringify(editedTask.tags) !== JSON.stringify(task.tags);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="task-modal-title">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                onKeyDown={handleKeyPress}
                className="task-title-input task-modal-title-input"
                autoFocus
              />
            ) : (
              <h3>{task.title}</h3>
            )}
          </div>
          <div className="task-modal-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary btn-sm">
                  Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm">
                Edit
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost">×</button>
          </div>
        </div>
        
        <div className="modal-content task-modal-content">
          {/* Status Section */}
          <div className="task-modal-section">
            <h4>📍 Status</h4>
            <div className="status-selector">
              {isEditing ? (
                <select
                  value={editedTask.statusId}
                  onChange={(e) => setEditedTask({ ...editedTask, statusId: e.target.value })}
                  className="form-select"
                >
                  {board.statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="current-status">
                  <span 
                    className="status-indicator" 
                    style={{ backgroundColor: currentStatus?.color }}
                  ></span>
                  <span className="status-name">{currentStatus?.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="task-modal-section">
            <h4>📝 Description</h4>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                onKeyDown={handleKeyPress}
                className="task-description-input task-modal-description"
                placeholder="Add a description..."
                rows={4}
              />
            ) : (
              <div className="task-description-display">
                {task.description ? (
                  <p>{task.description}</p>
                ) : (
                  <p className="no-description">No description provided</p>
                )}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="task-modal-section">
            <h4>🏷️ Tags</h4>
            <div className="tags-container">
              <div className="task-tags-display">
                {editedTask.tags.map((tag, index) => (
                  <span key={index} className="task-tag task-modal-tag">
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="tag-remove"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {editedTask.tags.length === 0 && (
                  <span className="no-tags">No tags</span>
                )}
              </div>
              
              {isEditing && (
                <div className="add-tag-form">
                  <input
                    type="text"
                    name="newTag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="tag-input"
                    placeholder="Add a tag..."
                  />
                  <button onClick={handleAddTag} className="btn btn-outline btn-sm">
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Info Section */}
          <div className="task-modal-section">
            <h4>ℹ️ Task Information</h4>
            <div className="task-info-grid">
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(task.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Task ID:</span>
                <span className="info-value task-id">{task.id}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="task-modal-section task-modal-footer">
            <div className="task-modal-footer-actions">
              {hasChanges && isEditing && (
                <div className="unsaved-changes">
                  <span>⚠️ You have unsaved changes</span>
                </div>
              )}
              
              <div className="footer-buttons">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      onDelete(task.id);
                      onClose();
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Delete Task
                </button>
                
                {isEditing && hasChanges && (
                  <button onClick={handleSave} className="btn btn-primary">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
