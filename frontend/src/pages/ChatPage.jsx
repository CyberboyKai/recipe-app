import { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import './ChatPage.css'; 

function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, isLoading, handleSend } = useContext(ChatContext);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Recipe Assistant</h2>
        <p>Ask about instructions, substitutions, or general cooking questions.</p>
      </div>

      <div className="chat-window">
        <div className="message-list">
       {messages.map((msg, index) => (
         <div key={index} className={`message-wrapper ${msg.role}`}>
           <div className={`message-bubble ${msg.role}`}>
             <ReactMarkdown>{msg.content}</ReactMarkdown>

           </div>
         </div>
       ))}
       {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-bubble assistant">Thinking...</div>
          </div>
       )}
     </div>

        <form className="chat-input-area" onSubmit={onSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a cooking question..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="chat-send-btn" disabled={isLoading}>
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;