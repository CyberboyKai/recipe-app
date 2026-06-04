import { createContext, useState, useContext } from 'react';
import { SpoonacularContext } from "./SpoonacularContext.js";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const { officialRecipes } = useContext(RecipesContext) || {};
  
  const handleSend = async (input) => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          recipes: recipes 
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, data]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, handleSend }}>
      {children}
    </ChatContext.Provider>
  );
};