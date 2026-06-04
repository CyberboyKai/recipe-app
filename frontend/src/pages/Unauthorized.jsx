import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <main className="route-message">
      <p className="eyebrow">Access denied</p>
      <h1>Admin access required</h1>
      <p>You need an admin account to view this page.</p>
      <Link className="button primary" to="/">
        Go home
      </Link>
    </main>
  );
};

export default Unauthorized;
