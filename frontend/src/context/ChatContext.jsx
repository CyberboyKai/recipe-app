import { createContext, useState } from 'react';
import axios from 'axios';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your culinary assistant. How can I help you with your recipe today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        messages: updatedMessages
      });

      const botResponse = response.data;
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'Oops! I am having trouble connecting to the kitchen right now.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, handleSend }}>
      {children}
    </ChatContext.Provider>
  );
}