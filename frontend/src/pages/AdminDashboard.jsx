import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { admin_logout, getCurrentAdmin } from "../features/admin/adminAuthSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin, token, loading, error, isAdminLoggedIn } = useSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    if (isAdminLoggedIn && token && !admin) {
      dispatch(getCurrentAdmin());
    }
  }, [dispatch, isAdminLoggedIn, token, admin]);

  const handleLogout = () => {
    dispatch(admin_logout());
    navigate("/admin/auth");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl border border-gray-800 rounded-2xl bg-gray-950 p-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-6">Admin authentication is active.</p>

        {loading && <p className="text-gray-300">Loading admin profile...</p>}

        {!loading && admin && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Username:</span> {admin.username}
            </p>
            <p>
              <span className="text-gray-400">Email:</span> {admin.email}
            </p>
            <p>
              <span className="text-gray-400">Id:</span> {admin.id}
            </p>
          </div>
        )}

        {!loading && !admin && (
          <p className="text-yellow-300 text-sm">Admin profile not loaded yet.</p>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white text-black font-semibold cursor-pointer"
          >
            Logout
          </button>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg border border-gray-700 text-white font-semibold"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
