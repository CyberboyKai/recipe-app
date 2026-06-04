import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AuthForm from '../components/AuthForm.jsx';
import useAuth from '../hooks/useAuth.js';

const loginFields = [
  {
    id: 'email',
    label: 'Email',
    autoComplete: 'email',
    placeholder: 'name@example.com',
    type: 'email',
  },
  {
    id: 'password',
    label: 'Password',
    autoComplete: 'current-password',
    placeholder: 'Enter your password',
    type: 'password',
  },
];

const getLoginErrorMessage = (errorCode) => {
  const messages = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
  };

  return messages[errorCode] || 'Unable to sign in. Please try again.';
};

const Login = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (authError) {
      setError(getLoginErrorMessage(authError.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link className="brand font-bold" to="/">
          RecipeApp
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your account</h1>
          <p>Save recipes, manage your creations, and keep cooking.</p>
        </div>

        <AuthForm
          error={error}
          fields={loginFields}
          isSubmitting={isSubmitting}
          mode="login"
          onSubmit={handleLogin}
        />
      </section>
    </main>
  );
};

export default Login;
