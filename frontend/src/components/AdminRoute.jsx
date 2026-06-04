import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth.js';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <main className="route-message">
        <p>Checking permissions...</p>
      </main>
    );
  }

  if (!currentUser) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate replace to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;
