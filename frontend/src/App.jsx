import { Routes, Route } from 'react-router-dom';

// Components & Context
import Navbar from './components/Navbar.jsx';
import RecipeChatbot from './component/RecipeChatbot.jsx';
import { ChatProvider } from './context/ChatContext';

// Pages
import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Recipes from './pages/Recipes.jsx';
import SignUp from './pages/SignUp.jsx';

const App = () => {
  return (
    <ChatProvider>
      {/* Keeping main's Tailwind layout wrapper */}
      <div className="min-h-screen bg-white">
        
        {/* The official team Navbar */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Your floating widget companion stays outside the layout div so it floats everywhere */}
      <RecipeChatbot />
    </ChatProvider>
  );
};

export default App;