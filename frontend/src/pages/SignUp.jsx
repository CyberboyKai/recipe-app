import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthForm from '../components/AuthForm.jsx';
import useAuth from '../hooks/useAuth.js';

const signUpFields = [
  {
    id: 'name',
    label: 'Name',
    autoComplete: 'name',
    placeholder: 'Your name',
    type: 'text',
  },
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
    autoComplete: 'new-password',
    placeholder: 'Create a password',
    type: 'password',
  },
];

const getSignUpErrorMessage = (errorCode) => {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
  };

  return messages[errorCode] || 'Unable to create account. Please try again.';
};

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async ({ email, name, password }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await signUp({ email, name, password });
      navigate('/', { replace: true });
    } catch (authError) {
      setError(getSignUpErrorMessage(authError.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="signup-title">
        <Link className="brand font-bold" to="/">
          RecipeApp
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Join the kitchen</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Start saving favorites and sharing recipes with the team.</p>
        </div>

        <AuthForm
          error={error}
          fields={signUpFields}
          isSubmitting={isSubmitting}
          mode="signup"
          onSubmit={handleSignUp}
        />
      </section>
    </main>
  );
};

export default SignUp;
