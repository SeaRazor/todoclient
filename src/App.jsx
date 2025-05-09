import { useState } from 'react'
import TodoList from './components/TodoList'
import ChatBot from './components/ChatBot'
import './styles.css'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="app">
      <div className="container">
        <TodoList />
      </div>
      <button 
        className="chat-button"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>
      <ChatBot open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App
