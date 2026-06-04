import { Link } from 'react-router-dom';

const AuthForm = ({
  error,
  fields,
  isSubmitting,
  mode,
  onSubmit,
  successMessage,
}) => {
  const isSignUp = mode === 'signup';

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));

    onSubmit(values);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-field" key={field.id}>
          <label htmlFor={field.id}>{field.label}</label>
          <input
            autoComplete={field.autoComplete}
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            required
            type={field.type}
          />
        </div>
      ))}

      {error && <p className="auth-message error">{error}</p>}
      {successMessage && <p className="auth-message success">{successMessage}</p>}

      <button className="button primary full" disabled={isSubmitting} type="submit">
        {isSubmitting
          ? 'Please wait...'
          : isSignUp
            ? 'Create account'
            : 'Sign in'}
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
