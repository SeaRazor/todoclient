import { useState } from 'react'
import TodoList from './components/TodoList'
import ChatBot from './components/ChatBot'
import './styles.css'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [todoRefreshKey, setTodoRefreshKey] = useState(0)

  const handleTodoCreated = () => {
    setTodoRefreshKey(k => k + 1)
  }

  return (
    <div className="app">
      <div className="container">
        <TodoList refreshKey={todoRefreshKey} />
      </div>
      <button 
        className="chat-button"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>
      <ChatBot open={isChatOpen} onClose={() => setIsChatOpen(false)} onTodoCreated={handleTodoCreated} />
    </div>
  )
}

export default App
