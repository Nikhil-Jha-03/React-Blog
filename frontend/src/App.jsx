import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Layout from './pages/Layout';


const App = () => {
  const isUserLoggedIn = useSelector(state => state.auth)
  return (
      <Routes>
        <Route path="/" element={isUserLoggedIn.isLoggedIn ? <Layout /> : <AuthPage />}>
          <Route index element={<LandingPage />} /> 
        </Route>
      </Routes>
  )
}

export default App;
