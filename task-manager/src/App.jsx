import React, { useState } from "react";
import TaskBoard from "./components/TaskBoard";
import AutomationModal from "./components/AutomationModal";
import AutomationOverview from "./components/AutomationOverview";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { createBoard } from "./utils/boardUtils";
import "./App.css";

function App() {
  // Initialize with a sample board
  const [board, setBoard] = useState(() => {
    const sampleBoard = createBoard(
      "My Project Board",
      "A simple task management board"
    );

    // Add sample automation rules
    sampleBoard.statuses[1].automations = [
      {
        id: "auto-1",
        name: 'Add "in-progress" tag when moved to In Progress',
        trigger: "move_to",
        fromStatusId: null,
        toStatusId: sampleBoard.statuses[1].id,
        actions: [
          {
            type: "add_tag",
            config: { tag: "in-progress" },
          },
          {
            type: "notification",
            config: { message: "Task moved to In Progress!" },
          },
        ],
        enabled: true,
      },
    ];

    sampleBoard.statuses[3].automations = [
      {
        id: "auto-2",
        name: 'Add "completed" tag when moved to Done',
        trigger: "move_to",
        fromStatusId: null,
        toStatusId: sampleBoard.statuses[3].id,
        actions: [
          {
            type: "add_tag",
            config: { tag: "completed" },
          },
          {
            type: "notification",
            config: { message: "Task completed! 🎉" },
          },
        ],
        enabled: true,
      },
    ];

    // Add some sample tasks
    sampleBoard.tasks = [
      {
        id: "task-1",
        title: "Design the user interface",
        description: "Create wireframes and mockups for the new feature",
        statusId: sampleBoard.statuses[0].id, // To Do
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["design", "ui"],
        metadata: {},
      },
      {
        id: "task-2",
        title: "Implement drag and drop",
        description: "Add drag and drop functionality using @dnd-kit",
        statusId: sampleBoard.statuses[1].id, // In Progress
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["development"],
        metadata: {},
      },
      {
        id: "task-3",
        title: "Write documentation",
        description: "Document the API and user guide",
        statusId: sampleBoard.statuses[2].id, // Review
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["documentation"],
        metadata: {},
      },
    ];

    return sampleBoard;
  });

  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [showAutomationOverview, setShowAutomationOverview] = useState(false);

  const handleUpdateBoard = (updatedBoard) => {
    setBoard(updatedBoard);
  };

  const handleConfigureAutomation = (statusId) => {
    setSelectedStatusId(statusId);
    setShowAutomationModal(true);
  };

  const handleSaveAutomation = (statusId, rule) => {
    const updatedBoard = { ...board };
    const statusIndex = updatedBoard.statuses.findIndex(
      (s) => s.id === statusId
    );

    if (statusIndex !== -1) {
      updatedBoard.statuses[statusIndex] = {
        ...updatedBoard.statuses[statusIndex],
        automations: [
          ...(updatedBoard.statuses[statusIndex].automations || []),
          rule,
        ],
      };
      updatedBoard.updatedAt = new Date();
      setBoard(updatedBoard);
    }
  };

  const handleToggleAutomationRule = (statusId, ruleId, enabled) => {
    const updatedBoard = { ...board };
    const statusIndex = updatedBoard.statuses.findIndex(
      (s) => s.id === statusId
    );

    if (statusIndex !== -1) {
      const ruleIndex = updatedBoard.statuses[
        statusIndex
      ].automations.findIndex((r) => r.id === ruleId);
      if (ruleIndex !== -1) {
        updatedBoard.statuses[statusIndex].automations[ruleIndex] = {
          ...updatedBoard.statuses[statusIndex].automations[ruleIndex],
          enabled,
        };
        updatedBoard.updatedAt = new Date();
        setBoard(updatedBoard);
      }
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar
          board={board}
          onUpdateBoard={handleUpdateBoard}
          onShowAutomationOverview={() => setShowAutomationOverview(true)}
        />

        <div className="main-content">
          <div className="main-content-header">
            <h1 className="board-title">{board.name}</h1>
            {board.description && (
              <p className="board-description">{board.description}</p>
            )}
            <div className="board-stats">
              <span className="stat">Total Tasks: {board.tasks.length}</span>
              <span className="stat">Columns: {board.statuses.length}</span>
            </div>
          </div>
          <div className="main-content-body">
            <TaskBoard
              board={board}
              onUpdateBoard={handleUpdateBoard}
              onConfigureAutomation={handleConfigureAutomation}
            />
          </div>
        </div>

        {showAutomationModal && (
          <AutomationModal
            board={board}
            statusId={selectedStatusId}
            onClose={() => setShowAutomationModal(false)}
            onSaveAutomation={handleSaveAutomation}
          />
        )}

        {showAutomationOverview && (
          <AutomationOverview
            board={board}
            onClose={() => setShowAutomationOverview(false)}
            onToggleRule={handleToggleAutomationRule}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
