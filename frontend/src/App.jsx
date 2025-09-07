import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage';
import { useSelector } from 'react-redux';
import Landingpage from './pages/Landingpage';


const App = () => {
  const isUserLoggedIn = useSelector(state => state.auth)
  return (
    <Routes>
      <Route path='/' element={isUserLoggedIn.isLoggedIn ? <Landingpage /> : <AuthPage />}></Route>
    </Routes>
  )
}

export default App;
