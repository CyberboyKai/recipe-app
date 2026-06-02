import { Link } from 'react-router-dom';

const AuthForm = ({ fields, mode }) => {
  const isSignUp = mode === 'signup';

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-field" key={field.id}>
          <label htmlFor={field.id}>{field.label}</label>
          <input
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            type={field.type}
          />
        </div>
      ))}

      <button className="button primary full" type="submit">
        {isSignUp ? 'Create account' : 'Sign in'}
      </button>

      <p className="auth-note">
        {isSignUp ? 'Already have an account?' : 'New to RECIPE-APP?'}{' '}
        <Link to={isSignUp ? '/login' : '/signup'}>
          {isSignUp ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </form>
  );
};

export default AuthForm;
