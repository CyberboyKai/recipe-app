import { Route, Routes } from 'react-router-dom';

import AdminRoute from './components/AdminRoute.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import Navbar from './components/Navbar.jsx';
import RecipeChatbot from './components/RecipeChatbot.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

import AdminPage from './pages/AdminPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import CreateRecipePage from './pages/CreateRecipePage.jsx';
import EditRecipePage from './pages/EditRecipePage.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import NotFound from './pages/NotFound.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import SignUp from './pages/SignUp.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
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
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/create-recipe" element={<CreateRecipePage />} />
            <Route path="/edit-recipe/:id" element={<EditRecipePage />} />
            <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <RecipeChatbot />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
