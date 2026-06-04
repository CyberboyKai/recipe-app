import { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import './RecipeChatbot.css'; 

function RecipeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, handleSend } = useContext(ChatContext);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(input); 
    setInput('');      
  };

  return (
    <div className="chatbot-widget-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Chat Window (Only visible when open) */}
      {isOpen && (
        <div className="chat-window widget-mode" style={{ width: '350px', height: '450px', marginBottom: '10px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
          <div className="chat-header" style={{ padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#000', color: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recipe Assistant</h3>
          </div>

          <div className="message-list" style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`message-bubble ${msg.role}`} style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '16px', fontSize: '0.9rem', backgroundColor: msg.role === 'user' ? '#000' : '#f5f5f5', color: msg.role === 'user' ? '#fff' : '#000', borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="message-wrapper assistant">
                 <div className="message-bubble assistant" style={{ backgroundColor: '#f5f5f5', padding: '10px 14px', borderRadius: '16px', fontSize: '0.9rem' }}>Thinking...</div>
               </div>
            )}
          </div>

          <form className="chat-input-area" onSubmit={onSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a cooking question..."
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '8px', marginRight: '8px' }}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        className="chatbot-toggle-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ float: 'right', padding: '12px 24px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        {isOpen ? 'Close Chat' : 'Ask AI Chef'}
      </button>
    </div>
  );
}

export default RecipeChatbot;