import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
