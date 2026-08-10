import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      setUser(null);

      alert("Logged out successfully!");

      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

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
          {user ? (
            <>
              <Link
                to="/my-links"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                My Links
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;