import { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { config } from '../config';
import '../styles.css';

function ChatBot({ open, onClose, onTodoCreated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (config.OPENAI_API_KEY) {
      chatService.setApiKey(config.OPENAI_API_KEY);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      // If the response indicates a todo was created, trigger refresh
      if (typeof response === 'object' && response.createdByChat) {
        onTodoCreated?.();
      } else if (typeof response === 'string' && response.includes('todo created by chat')) {
        onTodoCreated?.();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with AI</h2>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="chat-loading">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
          style={{ resize: 'vertical' }}
        />
        <button type="submit" className="chat-send" disabled={isLoading}>
          ➤
        </button>
      </form>
    </div>
  );
}

export default ChatBot;