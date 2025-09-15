import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage';
import Blog from './pages/Blog';
import BlogUpload from './pages/BlogUpload';
import { useSelector, useDispatch } from 'react-redux';
import { token_check } from './features/auth/authSlice';
import LandingPage from './pages/LandingPage';
import Layout from './pages/Layout';


const App = () => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.auth);
  // const navigate = useNavigate();

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
        <Route path='/blog' element={<Blog />} />
        <Route path='/blogupload' element={<BlogUpload />} />
      </Route>
    </Routes>
  )
}


// getCurrentUser is working now replace the dummuy user data with asyncronous user data


export default App;
