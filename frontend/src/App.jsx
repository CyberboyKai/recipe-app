import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import RecipeChatbot from './components/RecipeChatbot.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import NotFound from './pages/NotFound.jsx';
import Recipes from './pages/Recipes.jsx';
import SignUp from './pages/SignUp.jsx';

const App = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-white">
        
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <RecipeChatbot />
    </ChatProvider>
  );
};

export default App;