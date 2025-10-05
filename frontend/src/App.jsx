import { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogUpload = lazy(() => import("./pages/BlogUpload"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Layout = lazy(() => import("./pages/Layout"));
const MyPost = lazy(() => import("./pages/MyPost"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
import { useSelector, useDispatch } from 'react-redux';
import { token_check } from './features/auth/authSlice';


const App = () => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.auth);
  useEffect(() => {
    if (isUserLoggedIn.isLoggedIn) {
      dispatch(token_check())
    }
  }, [dispatch]);

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

      <Route path="/" element={<Layout />}>

        <Route index element={<LandingPage />} />

        <Route path='/blogupload' element={isUserLoggedIn.isLoggedIn ? <BlogUpload /> : <LandingPage />} />
        <Route path='/blog' element={isUserLoggedIn.isLoggedIn ? <Blog /> : <LandingPage />} />
        <Route path='/myblogs' element={isUserLoggedIn.isLoggedIn ? <MyPost /> : <LandingPage />} />
        <Route path='/myblogs/edit/:id' element={isUserLoggedIn.isLoggedIn ? <EditBlog/> : <LandingPage />} />

      </Route>
    </Routes>
  )
}


// getCurrentUser is working now replace the dummuy user data with asyncronous user data


export default App;
