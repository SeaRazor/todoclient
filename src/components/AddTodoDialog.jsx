import { useState } from 'react';
import Checkbox from './Checkbox';

function AddTodoDialog({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [daysToExpire, setDaysToExpire] = useState(7);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToExpire);

    onAdd({
      title: title.trim(),
      completed,
      daysToExpire: daysToExpire,
    });

    setTitle('');
    setDaysToExpire(7);
    setCompleted(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">Add New Todo</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="daysToExpire" className="form-label">Days to Expire</label>
            <input
              type="number"
              id="daysToExpire"
              className="form-input"
              value={daysToExpire}
              onChange={(e) => setDaysToExpire(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <label className="form-label">Completed</label>
            <Checkbox
              checked={completed}
              onChange={setCompleted}
            />
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTodoDialog; 