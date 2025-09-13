import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage';
import { useSelector, useDispatch } from 'react-redux';
import { token_check } from './features/auth/authSlice';
import LandingPage from './pages/LandingPage';
import Layout from './pages/Layout';
import { getCurrentUser } from './features/user/userSlice';


const App = () => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(token_check())
  }, [dispatch]);

  useEffect(() => {
  if (isUserLoggedIn.isLoggedIn && isUserLoggedIn.token) {
    dispatch(getCurrentUser(isUserLoggedIn.token))
  }
}, [isUserLoggedIn.isLoggedIn, isUserLoggedIn.token, dispatch])

  useEffect(() => {
    if (!isUserLoggedIn.isLoggedIn) {
      navigate("/");
    }
  }, [isUserLoggedIn.isLoggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={isUserLoggedIn.isLoggedIn ? <Layout /> : <AuthPage />}>
        <Route index element={<LandingPage />} />
      </Route>
    </Routes>
  )
}

export default App;
