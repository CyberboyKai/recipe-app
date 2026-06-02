import { Link } from 'react-router-dom';

import AuthForm from '../components/AuthForm.jsx';

const signUpFields = [
  {
    id: 'name',
    label: 'Name',
    placeholder: 'Your name',
    type: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    placeholder: 'name@example.com',
    type: 'email',
  },
  {
    id: 'password',
    label: 'Password',
    placeholder: 'Create a password',
    type: 'password',
  },
];

const SignUp = () => {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="signup-title">
        <Link className="brand" to="/">
          RECIPE-APP
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Join the kitchen</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Start saving favorites and sharing recipes with the team.</p>
        </div>

        <AuthForm fields={signUpFields} mode="signup" />
      </section>
    </main>
  );
};

export default SignUp;
