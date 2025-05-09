import { stubTodos } from './stubData';

// In-memory storage for todos
let todos = [...stubTodos];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const todoService = {
  // Get all todos
  async getAllTodos() {
    await delay(500); // Simulate network delay
    return [...todos];
  },

  // Create a new todo
  async createTodo(todo) {
    await delay(500);
    const newTodo = {
      id: Math.max(0, ...todos.map(t => t.id)) + 1,
      ...todo,
      expiryDate: todo.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days
    };
    todos.push(newTodo);
    return newTodo;
  },

  // Update a todo
  async updateTodo(id, updates) {
    await delay(500);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    todos[index] = { ...todos[index], ...updates };
    return todos[index];
  },

  // Delete a todo
  async deleteTodo(id) {
    await delay(500);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    todos = todos.filter(t => t.id !== id);
    return true;
  },
}; 