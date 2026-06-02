import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link className="brand" to="/">
          RECIPE-APP
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your account</h1>
          <p>Save recipes, manage your creations, and keep cooking.</p>
        </div>

        <form className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="name@example.com" type="email" />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />

          <button className="button primary full" type="submit">
            Sign in
          </button>
        </form>

        <p className="auth-note">
          New to RECIPE-APP? <Link to="/">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
