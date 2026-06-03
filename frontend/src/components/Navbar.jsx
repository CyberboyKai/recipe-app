import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-xs font-medium transition ${
      isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_auto] items-center gap-6 px-4 py-5">
        <NavLink to="/" className="brand-logo text-lg text-gray-950">
          RECIPE-APP
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
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
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/login" className="rounded-md border border-gray-300 bg-gray-50 px-4 py-1.5 text-xs font-medium hover:bg-gray-100">
            Sign in
          </NavLink>
          <NavLink to="/signup" className="rounded-md bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
