import axios from 'axios';
import {config} from "../config.js";

let axiosConfig = {
  headers: {
    "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE",
    "Content-Type": "application/json",
  }
}

export const todoService = {
  // Get all todos
  async getAllTodos() {
    const response = await axios.get(`${config.API_URL}todos`);
    let todos;
    todos = response.data;
    return [...todos];
  },

  async getExpiredTodos() {
    const response = await axios.get(`${config.API_URL}todos/expired`);
    let todos;
    todos = response.data;
    return [...todos];
  },

  // Create a new todo
  async createTodo(todo) {
    const response = await axios.post(`${config.API_URL}todos`, todo);
    return response.data;
} ,
  async deleteTodo(id) {
    await axios.delete(`${config.API_URL}todos/${id}`);
  },
  async updateTodo(id, todo) {
    const response = await axios.put(`${config.API_URL}todos/${id}`, todo, axiosConfig);
    return response.data;
  },



}; 