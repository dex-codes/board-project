import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STATUSES, AUTOMATION_ACTION_TYPES, AUTOMATION_TRIGGER_TYPES } from '../types.js';

/**
 * Create a new board with default settings
 * @param {string} name - Board name
 * @param {string} description - Board description
 * @returns {Board} New board object
 */
export const createBoard = (name, description = '') => {
  return {
    id: uuidv4(),
    name,
    description,
    statuses: DEFAULT_STATUSES.map(status => ({ ...status, id: uuidv4() })),
    tasks: [],
    globalAutomations: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Create a new task
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} statusId - Initial status ID
 * @returns {Task} New task object
 */
export const createTask = (title, description = '', statusId) => {
  return {
    id: uuidv4(),
    title,
    description,
    statusId,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    metadata: {}
  };
};

/**
 * Create a new automation rule
 * @param {string} name - Rule name
 * @param {string} trigger - Trigger type
 * @param {Object} config - Rule configuration
 * @returns {AutomationRule} New automation rule
 */
export const createAutomationRule = (name, trigger, config = {}) => {
  return {
    id: uuidv4(),
    name,
    trigger,
    fromStatusId: config.fromStatusId || null,
    toStatusId: config.toStatusId || null,
    actions: config.actions || [],
    enabled: true
  };
};

/**
 * Move a task to a different status
 * @param {Board} board - Current board state
 * @param {string} taskId - Task ID to move
 * @param {string} newStatusId - Target status ID
 * @param {number} newOrder - New order position
 * @returns {Board} Updated board state
 */
export const moveTask = (board, taskId, newStatusId, newOrder = 0) => {
  const updatedBoard = { ...board };
  const taskIndex = updatedBoard.tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) return board;

  const task = { ...updatedBoard.tasks[taskIndex] };
  const oldStatusId = task.statusId;

  // Update task
  task.statusId = newStatusId;
  task.order = newOrder;
  task.updatedAt = new Date();

  // Update tasks array
  updatedBoard.tasks = [...updatedBoard.tasks];
  updatedBoard.tasks[taskIndex] = task;

  // Reorder tasks in the target status
  updatedBoard.tasks = reorderTasksInStatus(updatedBoard.tasks, newStatusId);

  // Trigger automations
  updatedBoard.tasks = triggerAutomations(updatedBoard, task, oldStatusId, newStatusId);

  updatedBoard.updatedAt = new Date();
  return updatedBoard;
};

/**
 * Reorder tasks within a status column
 * @param {Task[]} tasks - Array of tasks
 * @param {string} statusId - Status ID to reorder
 * @returns {Task[]} Reordered tasks array
 */
export const reorderTasksInStatus = (tasks, statusId) => {
  const statusTasks = tasks.filter(task => task.statusId === statusId);
  const otherTasks = tasks.filter(task => task.statusId !== statusId);

  // Reassign order numbers
  const reorderedStatusTasks = statusTasks.map((task, index) => ({
    ...task,
    order: index
  }));

  return [...otherTasks, ...reorderedStatusTasks];
};

/**
 * Trigger automation rules when a task moves
 * @param {Board} board - Current board state
 * @param {Task} task - Task that moved
 * @param {string} fromStatusId - Previous status ID
 * @param {string} toStatusId - New status ID
 * @returns {Task[]} Updated tasks array
 */
export const triggerAutomations = (board, task, fromStatusId, toStatusId) => {
  let updatedTasks = [...board.tasks];

  // Find applicable automation rules
  const applicableRules = [
    ...board.globalAutomations,
    ...board.statuses.flatMap(status => status.automations || [])
  ].filter(rule => {
    if (!rule.enabled) return false;

    switch (rule.trigger) {
      case AUTOMATION_TRIGGER_TYPES.MOVE_TO:
        return rule.toStatusId === toStatusId;
      case AUTOMATION_TRIGGER_TYPES.MOVE_FROM:
        return rule.fromStatusId === fromStatusId;
      default:
        return false;
    }
  });

  // Execute automation actions
  applicableRules.forEach(rule => {
    rule.actions.forEach(action => {
      updatedTasks = executeAutomationAction(updatedTasks, task, action);
    });
  });

  return updatedTasks;
};

/**
 * Execute a single automation action
 * @param {Task[]} tasks - Current tasks array
 * @param {Task} task - Task that triggered the automation
 * @param {AutomationAction} action - Action to execute
 * @returns {Task[]} Updated tasks array
 */
export const executeAutomationAction = (tasks, task, action) => {
  const updatedTasks = [...tasks];
  const taskIndex = updatedTasks.findIndex(t => t.id === task.id);

  if (taskIndex === -1) return tasks;

  switch (action.type) {
    case AUTOMATION_ACTION_TYPES.ADD_TAG:
      if (action.config.tag && !updatedTasks[taskIndex].tags.includes(action.config.tag)) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          tags: [...updatedTasks[taskIndex].tags, action.config.tag],
          updatedAt: new Date()
        };
      }
      break;

    case AUTOMATION_ACTION_TYPES.REMOVE_TAG:
      if (action.config.tag) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          tags: updatedTasks[taskIndex].tags.filter(tag => tag !== action.config.tag),
          updatedAt: new Date()
        };
      }
      break;

    case AUTOMATION_ACTION_TYPES.UPDATE_FIELD:
      if (action.config.field && action.config.value !== undefined) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          [action.config.field]: action.config.value,
          updatedAt: new Date()
        };
      }
      break;

    case AUTOMATION_ACTION_TYPES.NOTIFICATION:
      // In a real app, this would trigger a notification system
      console.log(`Automation notification: ${action.config.message || 'Task moved'}`);
      break;

    default:
      console.warn(`Unknown automation action type: ${action.type}`);
  }

  return updatedTasks;
};

/**
 * Get tasks for a specific status
 * @param {Task[]} tasks - All tasks
 * @param {string} statusId - Status ID to filter by
 * @returns {Task[]} Filtered and sorted tasks
 */
export const getTasksForStatus = (tasks, statusId) => {
  return tasks
    .filter(task => task.statusId === statusId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Add a new status/list to the board
 * @param {Board} board - Current board state
 * @param {Status} newStatus - New status to add
 * @param {string} position - Position to add ('start' or 'end')
 * @returns {Board} Updated board state
 */
export const addStatusToBoard = (board, newStatus, position = 'end') => {
  const updatedBoard = { ...board };

  // Determine the order for the new status
  if (position === 'start') {
    // Add at the beginning - shift all existing orders
    updatedBoard.statuses = updatedBoard.statuses.map(status => ({
      ...status,
      order: status.order + 1
    }));
    newStatus.order = 0;
  } else {
    // Add at the end
    const maxOrder = Math.max(...updatedBoard.statuses.map(s => s.order), -1);
    newStatus.order = maxOrder + 1;
  }

  updatedBoard.statuses = [...updatedBoard.statuses, newStatus];
  updatedBoard.updatedAt = new Date();

  return updatedBoard;
};

/**
 * Delete a status/list from the board
 * @param {Board} board - Current board state
 * @param {string} statusId - Status ID to delete
 * @returns {Board} Updated board state
 */
export const deleteStatusFromBoard = (board, statusId) => {
  const updatedBoard = { ...board };

  // Check if there are tasks in this status
  const tasksInStatus = updatedBoard.tasks.filter(task => task.statusId === statusId);

  if (tasksInStatus.length > 0) {
    throw new Error(`Cannot delete status with ${tasksInStatus.length} tasks. Please move or delete the tasks first.`);
  }

  // Remove the status
  updatedBoard.statuses = updatedBoard.statuses.filter(status => status.id !== statusId);
  updatedBoard.updatedAt = new Date();

  return updatedBoard;
};

/**
 * Reorder columns in a board
 * @param {Board} board - The board to update
 * @param {string} activeColumnId - ID of the column being moved
 * @param {string} overColumnId - ID of the column to move over
 * @returns {Board} Updated board
 */
export const reorderColumns = (board, activeColumnId, overColumnId) => {
  const statuses = [...board.statuses];

  const activeIndex = statuses.findIndex(status => status.id === activeColumnId);
  const overIndex = statuses.findIndex(status => status.id === overColumnId);

  if (activeIndex === -1 || overIndex === -1) return board;

  // Remove the active column and insert it at the new position
  const [activeColumn] = statuses.splice(activeIndex, 1);
  statuses.splice(overIndex, 0, activeColumn);

  // Update order values
  statuses.forEach((status, index) => {
    status.order = index;
  });

  return {
    ...board,
    statuses,
    updatedAt: new Date()
  };
};

/**
 * Update column properties
 * @param {Board} board - The board to update
 * @param {string} columnId - ID of the column to update
 * @param {Object} updates - Properties to update
 * @returns {Board} Updated board
 */
export const updateColumn = (board, columnId, updates) => {
  const statuses = board.statuses.map(status => {
    if (status.id === columnId) {
      return {
        ...status,
        ...updates,
        updatedAt: new Date()
      };
    }
    return status;
  });

  return {
    ...board,
    statuses,
    updatedAt: new Date()
  };
};
