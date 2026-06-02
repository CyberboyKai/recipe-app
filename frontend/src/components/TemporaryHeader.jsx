import { Link, NavLink } from 'react-router-dom';

const navItems = ['Home', 'Recipe', 'My Recipe', 'Create Recipe'];

const TemporaryHeader = () => {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        RECIPE-APP
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive && item === 'Home' ? 'nav-link active' : 'nav-link'
            }
            key={item}
            to={item === 'Home' ? '/' : '#'}
          >
            {item}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="button ghost" to="/login">
          Sign in
        </Link>
        <Link className="button dark" to="/signup">
          Register
        </Link>
      </div>
    </header>
  );
};

export default TemporaryHeader;
