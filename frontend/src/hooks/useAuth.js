import { useContext } from 'react';

import { AuthContext } from '../context/authContext.js';

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return authContext;
};

export default useAuth;
