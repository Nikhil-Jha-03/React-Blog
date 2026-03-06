import { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminAuthPage = lazy(() => import("./pages/AdminAuthPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogUpload = lazy(() => import("./pages/BlogUpload"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Layout = lazy(() => import("./pages/Layout"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const MyPost = lazy(() => import("./pages/MyPost"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
import { useSelector, useDispatch } from 'react-redux';
import { token_check } from './features/auth/authSlice';
import { admin_token_check, getCurrentAdmin } from './features/admin/adminAuthSlice';
import ReadBlog from './pages/ReadBlog';


const App = () => {
  const dispatch = useDispatch();
  const userAuth = useSelector(state => state.auth);
  const adminAuth = useSelector(state => state.adminAuth);

  useEffect(() => {
    dispatch(token_check());
    dispatch(admin_token_check());
  }, [dispatch]);

  useEffect(() => {
    if (adminAuth.isAdminLoggedIn && adminAuth.token) {
      dispatch(getCurrentAdmin());
    }
  }, [dispatch, adminAuth.isAdminLoggedIn, adminAuth.token]);

  return (
    <Routes>
      {/* <Route path="/" element={isUserLoggedIn.isLoggedIn ? <Layout /> : <AuthPage />}> */}

      {/* User cannot access the auth route after Login
      <Route
        path="auth"
        element={
          isUserLoggedIn.isLoggedIn ? <Navigate to="/" /> : <AuthPage />
        }
      /> */}


      <Route path='auth' element={<AuthPage />}></Route>
      <Route
        path='/admin/auth'
        element={adminAuth.isAdminLoggedIn ? <Navigate to="/admin" /> : <AdminAuthPage />}
      />
      <Route
        path='/admin'
        element={adminAuth.isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/auth" />}
      />

      <Route path="/" element={<Layout />}>

        <Route index element={<LandingPage />} />
        <Route path='/about' element={<AboutPage />} />

        <Route path='/blogupload' element={userAuth.isLoggedIn ? <BlogUpload /> : <LandingPage />} />
        <Route path='/blog' element={userAuth.isLoggedIn ? <Blog /> : <LandingPage />} />
        <Route path='/myblogs' element={userAuth.isLoggedIn ? <MyPost /> : <LandingPage />} />
        <Route path='/myblogs/edit/:id' element={userAuth.isLoggedIn ? <EditBlog/> : <LandingPage />} />
        <Route path='/readblog/:id' element={userAuth.isLoggedIn ? <ReadBlog/> : <LandingPage />} />

      </Route>
    </Routes>
  )
}


// getCurrentUser is working now replace the dummuy user data with asyncronous user data


export default App;
