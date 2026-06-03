import { Route, Routes } from 'react-router-dom';

import AdminRoute from './components/AdminRoute.jsx';
import Navbar from './components/Navbar.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Recipes from './pages/Recipes.jsx';
import SignUp from './pages/SignUp.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
