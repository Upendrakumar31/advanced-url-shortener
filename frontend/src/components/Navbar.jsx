import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-white"
        >
          URL Shortener
        </Link>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;