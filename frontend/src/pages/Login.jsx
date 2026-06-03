import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';

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

const Login = () => {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        {/* Updated logo casing to match Figma */}
        <Link className="brand font-bold" to="/">
          RecipeApp
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your account</h1>
          <p>Save recipes, manage your creations, and keep cooking.</p>
        </div>

        <AuthForm fields={loginFields} mode="login" />
      </section>
    </main>
  );
};

export default Login;