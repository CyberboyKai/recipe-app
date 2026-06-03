import { Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import NotFound from './pages/NotFound.jsx';

// Import your new features
import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import RecipeChatbot from './component/RecipeChatbot.jsx';
import { ChatProvider } from './context/ChatContext';

const App = () => {
  return (
    <ChatProvider>
      {/* Sleek, Modern Navbar matching Figma theme */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #eaeaea',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000', textDecoration: 'none' }}>
          🍽️ RecipeApp
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: '500', color: '#666', textDecoration: 'none' }}>Home</Link>
          <Link to="/recipes" style={{ fontWeight: '500', color: '#666', textDecoration: 'none' }}>Recipes</Link>
          <Link to="/admin" style={{ fontWeight: '500', color: '#666', textDecoration: 'none' }}>Admin</Link>
          <Link to="/chat" style={{ fontWeight: '500', color: '#666', textDecoration: 'none' }}>Chatbot</Link>
        </div>
      </nav>

      {/* Where the pages actually render */}
      <div style={{ padding: '2rem' }}>
        <Routes>
          {/* Main branch routes */}
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          
          {/* Your feature routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Catch-all 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* The floating widget companion */}
      <RecipeChatbot />
    </ChatProvider>
  );
};

export default App;