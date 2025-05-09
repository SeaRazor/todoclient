import { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import AddTodoDialog from './AddTodoDialog';
import Checkbox from './Checkbox';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
    }
  };

  const handleAddTodo = async (todo) => {
    try {
      const newTodo = await todoService.createTodo(todo);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todo.completed,
      });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getDaysToExpire = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h1 className="todo-title">Todo List</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Todo
        </button>
      </div>

      <ul className="todo-items">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <div className="todo-content">
              <div className="todo-title" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
              </div>
              <div className="todo-subtitle">
                Days to expire: {getDaysToExpire(todo.expiryDate)}
              </div>
            </div>
            <button
              className="todo-delete"
              onClick={() => deleteTodo(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <AddTodoDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  );
}

export default TodoList; 