import { useState } from 'react';
import axios from 'axios';
import './RecipeChatbot.css'; 

function RecipeChatbot({ recipeTitle, ingredients }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: `You are a helpful culinary assistant. The user is currently cooking ${recipeTitle}. The ingredients are: ${ingredients}. Answer their questions specifically about this recipe.` 
    }
  ]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/chat', {
        messages: newMessages
      });
      setMessages([...newMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recipe-chatbot">
      <h3>Ask the Chef</h3>
      <div className="chat-window">
        {messages.filter(m => m.role !== 'system').map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Chef: '}</strong> {msg.content}
          </div>
        ))}
        {isLoading && <p><em>Chef is typing...</em></p>}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask about substitutions or steps..."
        />
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}

export default RecipeChatbot;