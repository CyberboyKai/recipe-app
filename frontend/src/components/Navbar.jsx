import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import useAuth from '../hooks/useAuth.js';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, isAdmin, isAuthLoading, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `rounded-md px-4 py-2 text-xs font-medium transition ${
      isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black'
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  const authControls = (
    <>
      {isAuthLoading ? null : currentUser ? (
        <button
          className="rounded-md bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-800"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      ) : (
        <>
          <NavLink
            to="/login"
            className="rounded-md border border-gray-300 bg-gray-50 px-5 py-2 text-xs font-medium hover:bg-gray-100"
            onClick={closeMenu}
          >
            Sign in
          </NavLink>

          <NavLink
            to="/signup"
            className="rounded-md bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-800"
            onClick={closeMenu}
          >
            Register
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_auto] items-center gap-8 px-4 py-5">
        <NavLink to="/" className="brand-logo text-lg font-bold text-gray-950">
          RecipeApp
        </NavLink>

        <div className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={linkClass}>
            Recipes
          </NavLink>
          <NavLink to="/my-recipes" className={linkClass}>
            My Recipes
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Create Recipe
          </NavLink>
          <NavLink to="/chat" className={linkClass}>
            Chatbot
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">{authControls}</div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col justify-center gap-1 md:hidden"
          type="button"
        >
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-2 pt-3">
            <NavLink onClick={closeMenu} to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink onClick={closeMenu} to="/recipes" className={linkClass}>
              Recipes
            </NavLink>
            <NavLink onClick={closeMenu} to="/my-recipes" className={linkClass}>
              My Recipes
            </NavLink>
            <NavLink onClick={closeMenu} to="/create" className={linkClass}>
              Create Recipe
            </NavLink>
            <NavLink onClick={closeMenu} to="/chat" className={linkClass}>
              Chatbot
            </NavLink>
            {isAdmin && (
              <NavLink onClick={closeMenu} to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}

            <div className="mt-3 flex flex-col gap-2">{authControls}</div>
          </div>
        </div>
      )}
    </nav>
  );
}