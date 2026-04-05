import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { admin_logout, getCurrentAdmin } from "../features/admin/adminAuthSlice";
import api from "../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin, token, loading, error, isAdminLoggedIn } = useSelector(
    (state) => state.adminAuth
  );
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [updatingFeatureBlogId, setUpdatingFeatureBlogId] = useState(null);

  useEffect(() => {
    if (isAdminLoggedIn && token && !admin) {
      dispatch(getCurrentAdmin());
    }
  }, [dispatch, isAdminLoggedIn, token, admin]);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const fetchDashboardData = async () => {
    if (!token) return;
    setDashboardLoading(true);

    try {
      const [blogsResponse, usersResponse] = await Promise.all([
        api.get("/api/v1/admin/blogs", getAuthConfig()),
        api.get("/api/v1/admin/users", getAuthConfig())
      ]);

      setBlogs(blogsResponse?.data?.blogs || []);
      setUsers(usersResponse?.data?.users || []);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to load admin dashboard data";
      toast.error(message);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && token) {
      fetchDashboardData();
    }
  }, [isAdminLoggedIn, token]);

  const handleLogout = () => {
    dispatch(admin_logout());
    navigate("/admin/auth");
  };

  const handleDeleteBlog = async (blogId) => {
    const confirmDelete = window.confirm(
      "Delete this blog? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeletingBlogId(blogId);
      const response = await api.delete(`/api/v1/admin/blogs/${blogId}`, getAuthConfig());
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      toast.success(response?.data?.message || "Blog deleted");
    } catch (apiError) {
      const message = apiError?.response?.data?.message || "Failed to delete blog";
      toast.error(message);
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Delete this user and related blogs/comments? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      const response = await api.delete(`/api/v1/admin/users/${userId}`, getAuthConfig());
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setBlogs((prev) =>
        prev.filter((blog) => {
          const blogAuthorId =
            typeof blog.userId === "object" ? blog.userId?._id : blog.userId;
          return blogAuthorId !== userId;
        })
      );
      toast.success(response?.data?.message || "User deleted");
    } catch (apiError) {
      const message = apiError?.response?.data?.message || "Failed to delete user";
      toast.error(message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleToggleFeature = async (blogId, nextFeatureValue) => {
    try {
      setUpdatingFeatureBlogId(blogId);
      const response = await api.patch(
        `/api/v1/admin/blogs/${blogId}/feature`,
        { feature: nextFeatureValue },
        getAuthConfig()
      );

      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId ? { ...blog, feature: response?.data?.blog?.feature } : blog
        )
      );

      toast.success(
        response?.data?.message ||
          (nextFeatureValue ? "Blog marked as featured" : "Blog unfeatured")
      );
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to update featured status";
      toast.error(message);
    } finally {
      setUpdatingFeatureBlogId(null);
    }
  };

  const featuredCount = blogs.filter((blog) => blog.feature).length;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border border-gray-800 rounded-2xl bg-gray-950 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">
                Manage all blogs and signed-up users from one place.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 rounded-lg border border-gray-700 text-white font-semibold cursor-pointer"
              >
                Refresh Data
              </button>
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

          {loading && <p className="text-gray-300 mt-4">Loading admin profile...</p>}

          {!loading && admin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mt-5">
              <p className="rounded-lg border border-gray-800 p-3">
                <span className="text-gray-400">Username:</span> {admin.username}
              </p>
              <p className="rounded-lg border border-gray-800 p-3">
                <span className="text-gray-400">Email:</span> {admin.email}
              </p>
              <p className="rounded-lg border border-gray-800 p-3">
                <span className="text-gray-400">Id:</span> {admin.id}
              </p>
            </div>
          )}

          {!loading && !admin && (
            <p className="text-yellow-300 text-sm mt-4">Admin profile not loaded yet.</p>
          )}

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-800 rounded-xl bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Total Blogs</p>
            <h2 className="text-2xl font-bold mt-1">{blogs.length}</h2>
          </div>
          <div className="border border-gray-800 rounded-xl bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Total Users</p>
            <h2 className="text-2xl font-bold mt-1">{users.length}</h2>
          </div>
          <div className="border border-gray-800 rounded-xl bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Featured Blogs</p>
            <h2 className="text-2xl font-bold mt-1">{featuredCount} / 3</h2>
          </div>
          <div className="border border-gray-800 rounded-xl bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Dashboard Status</p>
            <h2 className="text-2xl font-bold mt-1">
              {dashboardLoading ? "Loading..." : "Ready"}
            </h2>
          </div>
        </div>

        <div className="border border-gray-800 rounded-2xl bg-gray-950 p-6">
          <h2 className="text-2xl font-semibold">All Blogs</h2>
          <p className="text-gray-400 text-sm mt-1">
            Admin can delete any blog from any user.
          </p>

          <div className="mt-5 space-y-3">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-800"
                    />
                    <div>
                      <p className="font-semibold text-lg">{blog.title}</p>
                      <p className="text-sm text-gray-400">
                        By: {blog.userId?.name || "Unknown"} ({blog.userId?.email || "NA"})
                      </p>
                      <p className="text-sm text-gray-500">
                        Category: {blog.category?.category || "Uncategorized"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {blog.status} | Created:{" "}
                        {new Date(blog.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        Featured: {blog.feature ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFeature(blog._id, !blog.feature)}
                      disabled={
                        updatingFeatureBlogId === blog._id ||
                        (!blog.feature && featuredCount >= 3)
                      }
                      className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
                    >
                      {updatingFeatureBlogId === blog._id
                        ? "Updating..."
                        : blog.feature
                        ? "Remove Featured"
                        : "Make Featured"}
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      disabled={deletingBlogId === blog._id}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 cursor-pointer"
                    >
                      {deletingBlogId === blog._id ? "Deleting..." : "Delete Blog"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No blogs found.</p>
            )}
          </div>
        </div>

        <div className="border border-gray-800 rounded-2xl bg-gray-950 p-6">
          <h2 className="text-2xl font-semibold">Signed-Up Users</h2>
          <p className="text-gray-400 text-sm mt-1">
            Admin can see and delete any user account.
          </p>

          <div className="mt-5 space-y-3">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Verified: {user.isAccountVerified ? "Yes" : "No"} | AI Credits:{" "}
                      {user.aiCredit}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={deletingUserId === user._id}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 cursor-pointer"
                  >
                    {deletingUserId === user._id ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
