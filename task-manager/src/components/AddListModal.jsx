import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AddListModal = ({ board, onClose, onAddList }) => {
  const [listName, setListName] = useState('');
  const [listColor, setListColor] = useState('#e2e8f0');
  const [position, setPosition] = useState('end');

  const predefinedColors = [
    { name: 'Gray', value: '#e2e8f0' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#fbbf24' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#a78bfa' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!listName.trim()) {
      alert('Please enter a list name');
      return;
    }

    const newList = {
      id: uuidv4(),
      name: listName.trim(),
      color: listColor,
      order: position === 'start' ? -1 : board.statuses.length,
      automations: []
    };

    onAddList(newList, position);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal add-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Add New List</h3>
          <button onClick={onClose} className="btn btn-ghost">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label htmlFor="listName">List Name</label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="task-title-input"
              placeholder="Enter list name..."
              autoFocus
              maxLength={50}
            />
            <small className="form-help">
              Choose a descriptive name for your new status column
            </small>
          </div>

          <div className="form-group">
            <label>List Color</label>
            <div className="color-picker">
              {predefinedColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`color-option ${listColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setListColor(color.value)}
                  title={color.name}
                >
                  {listColor === color.value && '✓'}
                </button>
              ))}
            </div>
            <div className="custom-color-input">
              <label htmlFor="customColor">Custom Color:</label>
              <input
                id="customColor"
                type="color"
                value={listColor}
                onChange={(e) => setListColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Position</label>
            <div className="position-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="position"
                  value="start"
                  checked={position === 'start'}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <span>Add at beginning</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="position"
                  value="end"
                  checked={position === 'end'}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <span>Add at end</span>
              </label>
            </div>
          </div>

          <div className="list-preview">
            <h4>Preview:</h4>
            <div className="preview-list" style={{ backgroundColor: listColor }}>
              <div className="preview-header">
                <span className="preview-title">
                  {listName || 'New List'}
                </span>
                <span className="preview-count">0</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Create List
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListModal;
