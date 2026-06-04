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
            <Route path="/recipes" element={<Recipes />} />
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