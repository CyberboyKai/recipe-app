import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded-full text-sm transition ${
      isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* LEFT: LOGO */}
        <div className="font-semibold text-lg">RecipeApp</div>

        {/* CENTER: NAV LINKS */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={linkClass}>
            Recipes
          </NavLink>
          <NavLink to="/my-recipes" className={linkClass}>
            My Recipe
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Create Recipe
          </NavLink>
        </div>

        {/* RIGHT: AUTH */}
        <div className="flex items-center gap-2">
          <NavLink to="/sign-in" className="rounded-full border border-gray-300 px-4 py-1 text-sm hover:bg-gray-100">
            Sign in
          </NavLink>
          <NavLink to="/register" className="rounded-full bg-black px-4 py-1 text-sm text-white hover:bg-gray-800">
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
