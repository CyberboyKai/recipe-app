import { createContext, useState, useContext } from 'react';
import { RecipesContext } from './RecipesContext.js';
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const { officialRecipes } = useContext(RecipesContext) || {};

  const handleSend = async (rawInput) => {
    const content = rawInput.trim();
    if (!content || isLoading) return;

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          recipes: officialRecipes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Chat request failed (${response.status})`);
      }

      const data = await response.json();

      if (!data?.role || typeof data.content !== 'string') {
        throw new Error('Invalid chat response payload');
      }

      setMessages([...newMessages, data]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry—something went wrong while generating a response. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, handleSend }}>
      {children}
    </ChatContext.Provider>
  );