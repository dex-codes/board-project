// Data structure definitions for the task management system

/**
 * Task Status/Column Definition
 * @typedef {Object} Status
 * @property {string} id - Unique identifier for the status
 * @property {string} name - Display name of the status
 * @property {string} color - Color theme for the status column
 * @property {number} order - Order position of the status column
 * @property {AutomationRule[]} automations - Automation rules for this status
 */

/**
 * Task Definition
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title/name
 * @property {string} description - Task description
 * @property {string} statusId - Current status/column ID
 * @property {number} order - Order within the status column
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string[]} tags - Array of tags
 * @property {Object} metadata - Additional custom data
 */

/**
 * Automation Rule Definition
 * @typedef {Object} AutomationRule
 * @property {string} id - Unique identifier for the rule
 * @property {string} name - Rule name
 * @property {string} trigger - Trigger type ('move_to', 'move_from', 'time_based')
 * @property {string} fromStatusId - Source status ID (for move triggers)
 * @property {string} toStatusId - Target status ID (for move triggers)
 * @property {AutomationAction[]} actions - Actions to execute
 * @property {boolean} enabled - Whether the rule is active
 */

/**
 * Automation Action Definition
 * @typedef {Object} AutomationAction
 * @property {string} type - Action type ('notification', 'webhook', 'update_field', 'move_task')
 * @property {Object} config - Action-specific configuration
 */

/**
 * Board Definition
 * @typedef {Object} Board
 * @property {string} id - Unique identifier for the board
 * @property {string} name - Board name
 * @property {string} description - Board description
 * @property {Status[]} statuses - Array of status columns
 * @property {Task[]} tasks - Array of tasks
 * @property {AutomationRule[]} globalAutomations - Board-level automation rules
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

// Default status columns for a new board
export const DEFAULT_STATUSES = [
  {
    id: 'todo',
    name: 'To Do',
    color: '#e2e8f0',
    order: 0,
    automations: []
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    color: '#fbbf24',
    order: 1,
    automations: []
  },
  {
    id: 'review',
    name: 'Review',
    color: '#a78bfa',
    order: 2,
    automations: []
  },
  {
    id: 'done',
    name: 'Done',
    color: '#10b981',
    order: 3,
    automations: []
  }
];

// Automation action types
export const AUTOMATION_ACTION_TYPES = {
  NOTIFICATION: 'notification',
  WEBHOOK: 'webhook',
  UPDATE_FIELD: 'update_field',
  MOVE_TASK: 'move_task',
  ADD_TAG: 'add_tag',
  REMOVE_TAG: 'remove_tag'
};

// Automation trigger types
export const AUTOMATION_TRIGGER_TYPES = {
  MOVE_TO: 'move_to',
  MOVE_FROM: 'move_from',
  TIME_BASED: 'time_based'
};
