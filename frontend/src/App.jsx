import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import NotFound from './pages/NotFound.jsx';
import Recipes from './pages/Recipes.jsx';
import SignUp from './pages/SignUp.jsx';

const App = () => {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </AuthProvider>
  );
};

export default App;
