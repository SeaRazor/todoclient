import { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import AddTodoDialog from './AddTodoDialog';
import Checkbox from './Checkbox';

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function TodoList({ refreshKey }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchTodos();
  }, [refreshKey]);

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
        ...todo,
        isCompleted: !todo.isCompleted,
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

  // Filter logic
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const todosToDisplay = filteredTodos.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h1 className="todo-title">Todo List</h1>
        <input
          className="form-input"
          type="text"
          placeholder="Filter by title..."
          value={filterText}
          onChange={e => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginLeft: 16, flex: 1, maxWidth: 200 }}
        />
        <button
          className="btn btn-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Todo
        </button>
      </div>
      <ul className="todo-items">
        {todosToDisplay.map((todo) => (
          <li key={todo.id} className="todo-item">
            <Checkbox
              checked={todo.isCompleted}
              onChange={() => toggleTodo(todo.id)}
            />
            <div className="todo-content">
              <div className="todo-title" style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
                {todo.title}
              </div>
              <div className="todo-subtitle">
                Days to expire: {todo.daysToExpire}
              </div>
              <div className="todo-subtitle">
                Created Date: {formatDate(todo.dateCreated)}
              </div>
            </div>
            <button
              className="todo-delete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {/* Paging controls */}
      {totalPages > 1 && (
        <div className="paging-controls">
          <button className="btn" onClick={handlePrevPage} disabled={currentPage === 1}>&laquo; Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="btn" onClick={handleNextPage} disabled={currentPage === totalPages}>Next &raquo;</button>
        </div>
      )}
      <AddTodoDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  );
}

export default TodoList;