import React from 'react';

const AddListButton = ({ onClick }) => {
  return (
    <div className="add-list-button" onClick={onClick}>
      <div className="add-list-content">
        <div className="add-list-icon">
          ➕
        </div>
        <div className="add-list-text">
          <h4>Add New List</h4>
          <p>Create a new status column</p>
        </div>
      </div>
    </div>
  );
};

export default AddListButton;
