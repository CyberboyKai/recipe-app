import { Routes, Route, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  return (
    <>
      {/* Navigation Bar */}
      <nav style={{ padding: '20px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/admin" style={{ marginRight: '20px', fontWeight: 'bold' }}>Admin Dashboard</Link>
        <Link to="/chat" style={{ fontWeight: 'bold' }}>Recipe Chatbot</Link>
      </nav>

      {/* Where the pages actually render */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;