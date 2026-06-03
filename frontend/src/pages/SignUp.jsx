import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';

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

const SignUp = () => {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="signup-title">
        {/* Updated logo casing to match Figma */}
        <Link className="brand font-bold" to="/">
          RecipeApp
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