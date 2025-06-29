import React, { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const StatusColumn = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onConfigureAutomation,
  onTaskClick,
  onUpdateColumn,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef(null);

  // Droppable for tasks
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: status.id,
  });

  // Sortable for column reordering
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${status.id}`,
    data: {
      type: "column",
      status: status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(status.id, {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    }
  };

  const handleCancel = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAddingTask(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const setRefs = (element) => {
    setSortableRef(element);
    setDroppableRef(element);
  };

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Predefined color palette
  const colorPalette = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Orange
    "#ec4899", // Pink
    "#6b7280", // Gray
  ];

  const handleColorChange = (color) => {
    if (onUpdateColumn) {
      onUpdateColumn(status.id, { color });
    }
    setShowColorPicker(false);
    setShowOptionsMenu(false);
  };

  const handleCopyList = () => {
    // TODO: Implement copy list functionality
    console.log("Copying list:", status.name);
    setShowOptionsMenu(false);
  };

  const handleArchiveList = () => {
    // TODO: Implement archive list functionality
    console.log("Archiving list:", status.name);
    setShowOptionsMenu(false);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={`status-column ${isDragging ? "dragging" : ""}`}
    >
      <div className="status-header" style={{ backgroundColor: status.color }}>
        <div className="status-title-section">
          <div
            className="column-drag-handle"
            {...attributes}
            {...listeners}
            title="Drag to reorder column"
          >
            ⋮⋮
          </div>
          <h3 className="status-title">{status.name}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <div className="status-actions">
          <button
            onClick={() => setIsAddingTask(true)}
            className="btn btn-ghost btn-sm"
            title="Add new task"
          >
            +
          </button>
          <div className="column-options-menu" ref={menuRef}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="btn btn-ghost btn-sm"
              title="Column options"
            >
              ⋯
            </button>
            {showOptionsMenu && (
              <div className="options-dropdown">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="dropdown-item"
                >
                  <span className="dropdown-icon">●</span> Change Color
                </button>
                <button onClick={handleCopyList} className="dropdown-item">
                  <span className="dropdown-icon">⧉</span> Copy List
                </button>
                <button onClick={handleArchiveList} className="dropdown-item">
                  <span className="dropdown-icon">□</span> Archive List
                </button>
                <button
                  onClick={() => {
                    onConfigureAutomation(status.id);
                    setShowOptionsMenu(false);
                  }}
                  className="dropdown-item"
                >
                  <span className="dropdown-icon">⚙</span> Settings
                </button>
                {showColorPicker && (
                  <div className="color-picker-section">
                    <div className="color-palette">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="custom-color-input">
                      <input
                        type="color"
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="color-input"
                        title="Custom color"
                      />
                      <span className="color-input-label">Custom</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`status-content ${isOver ? "drag-over" : ""}`}>
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>

        {isAddingTask && (
          <div className="add-task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="task-title-input"
              placeholder="Task title..."
              autoFocus
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              className="task-description-input"
              placeholder="Task description..."
              rows={3}
            />
            <div className="add-task-actions">
              <button
                onClick={handleAddTask}
                className="btn btn-primary btn-sm"
              >
                Add Task
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {tasks.length === 0 && !isAddingTask && (
          <div className="empty-status">
            <p>No tasks yet</p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="btn btn-outline btn-sm"
            >
              Add first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
