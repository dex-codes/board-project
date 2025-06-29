import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import StatusColumn from "./StatusColumn";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import AddListButton from "./AddListButton";
import {
  moveTask,
  getTasksForStatus,
  createTask,
  reorderColumns,
  updateColumn,
} from "../utils/boardUtils";

const TaskBoard = ({
  board,
  onUpdateBoard,
  onConfigureAutomation,
  onAddList,
}) => {
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;

    console.log("Drag started:", {
      id: active.id,
      type: active.data.current?.type,
      data: active.data.current,
    });

    // Check if it's a column by ID format or data type
    if (
      active.data.current?.type === "column" ||
      active.id.toString().startsWith("column-")
    ) {
      setActiveColumn(
        active.data.current?.status || { id: active.id.replace("column-", "") }
      );
    } else {
      const task = board.tasks.find((task) => task.id === active.id);
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log("Drag ended:", {
      activeId: active.id,
      activeType: active.data.current?.type,
      overId: over?.id,
      overType: over?.data.current?.type,
      activeData: active.data.current,
      overData: over?.data.current,
    });

    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    // Handle column reordering - prioritize this over task movement
    if (
      active.data.current?.type === "column" ||
      active.id.toString().startsWith("column-")
    ) {
      console.log("Processing column drag");
      // Check if we're dropping over another column or column area
      if (
        over.data.current?.type === "column" ||
        over.id.toString().startsWith("column-")
      ) {
        const activeColumnId =
          active.data.current?.status?.id || active.id.replace("column-", "");
        const overColumnId =
          over.data.current?.status?.id || over.id.replace("column-", "");

        console.log("Reordering columns:", activeColumnId, "->", overColumnId);

        if (activeColumnId !== overColumnId) {
          const updatedBoard = reorderColumns(
            board,
            activeColumnId,
            overColumnId
          );
          onUpdateBoard(updatedBoard);
        }
      }
      return; // Always return early for column drags
    }

    // Handle task movement only if we're not dragging a column
    if (
      active.data.current?.type !== "column" &&
      !active.id.toString().startsWith("column-")
    ) {
      const activeTaskId = active.id;
      const overStatusId = over.id;

      // Find the active task
      const activeTask = board.tasks.find((task) => task.id === activeTaskId);
      if (!activeTask) return;

      // If dropping on the same status, don't do anything for now
      if (activeTask.statusId === overStatusId) return;

      // Move the task to the new status
      const updatedBoard = moveTask(board, activeTaskId, overStatusId);
      onUpdateBoard(updatedBoard);
    }
  };

  const handleAddTask = (statusId, taskData) => {
    const newTask = createTask(taskData.title, taskData.description, statusId);
    const updatedBoard = {
      ...board,
      tasks: [...board.tasks, newTask],
      updatedAt: new Date(),
    };
    onUpdateBoard(updatedBoard);
  };

  const handleEditTask = (taskId, updates) => {
    const updatedTasks = board.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    const updatedBoard = {
      ...board,
      tasks: updatedTasks,
      updatedAt: new Date(),
    };
    onUpdateBoard(updatedBoard);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = board.tasks.filter((task) => task.id !== taskId);
      const updatedBoard = {
        ...board,
        tasks: updatedTasks,
        updatedAt: new Date(),
      };
      onUpdateBoard(updatedBoard);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateColumn = (columnId, updates) => {
    const updatedBoard = updateColumn(board, columnId, updates);
    onUpdateBoard(updatedBoard);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleSaveTaskFromModal = (taskId, updates) => {
    handleEditTask(taskId, updates);
    // Keep modal open to show updated data
    const updatedTask = { ...selectedTask, ...updates, updatedAt: new Date() };
    setSelectedTask(updatedTask);
  };

  return (
    <div className="task-board">
      <div className="board-columns-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-columns">
            <SortableContext
              items={board.statuses.map((status) => `column-${status.id}`)}
              strategy={horizontalListSortingStrategy}
            >
              {board.statuses
                .sort((a, b) => a.order - b.order)
                .map((status) => (
                  <StatusColumn
                    key={status.id}
                    status={status}
                    tasks={getTasksForStatus(board.tasks, status.id)}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onConfigureAutomation={onConfigureAutomation}
                    onTaskClick={handleTaskClick}
                    onUpdateColumn={handleUpdateColumn}
                  />
                ))}
            </SortableContext>

            <AddListButton onClick={onAddList} />
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="drag-overlay">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : activeColumn ? (
              <div className="drag-overlay">
                <StatusColumn
                  status={activeColumn}
                  tasks={getTasksForStatus(board.tasks, activeColumn.id)}
                  onAddTask={() => {}}
                  onEditTask={() => {}}
                  onDeleteTask={() => {}}
                  onConfigureAutomation={() => {}}
                  onTaskClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          board={board}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTaskFromModal}
          onDelete={(taskId) => {
            handleDeleteTask(taskId);
            handleCloseTaskModal();
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
