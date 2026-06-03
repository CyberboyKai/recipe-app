import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-xs font-medium transition ${
      isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_auto] items-center gap-6 px-4 py-5">
        
        {/* Logo - Updated to bold CamelCase */}
        <NavLink to="/" className="brand-logo text-lg font-bold text-gray-950">
          RecipeApp
        </NavLink>

        {/* DESKTOP LINKS */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/recipes" className={linkClass}>Recipes</NavLink>
          <NavLink to="/my-recipes" className={linkClass}>My Recipes</NavLink>
          <NavLink to="/create" className={linkClass}>Create Recipe</NavLink>
          
          {/* Your Feature Links */}
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          <NavLink to="/chat" className={linkClass}>Chatbot</NavLink>
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/login"
            className="rounded-md border border-gray-300 bg-gray-50 px-4 py-1.5 text-xs font-medium hover:bg-gray-100"
          >
            Sign in
          </NavLink>

          <NavLink
            to="/signup"
            className="rounded-md bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
          >
            Register
          </NavLink>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center gap-1"
        >
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 pb-4">
          <div className="flex flex-col gap-2 pt-3">
            <NavLink onClick={() => setMenuOpen(false)} to="/" className={linkClass}>Home</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/recipes" className={linkClass}>Recipes</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/my-recipes" className={linkClass}>My Recipes</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/create" className={linkClass}>Create Recipe</NavLink>
            
            {/* Your Feature Links for Mobile */}
            <NavLink onClick={() => setMenuOpen(false)} to="/admin" className={linkClass}>Admin</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/chat" className={linkClass}>Chatbot</NavLink>

            <div className="mt-3 flex flex-col gap-2">
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/login"
                className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-medium hover:bg-gray-100"
              >
                Sign in
              </NavLink>

              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/signup"
                className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}